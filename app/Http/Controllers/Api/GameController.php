<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cost;
use App\Models\Falling;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Mews\Captcha\Facades\Captcha;

class GameController extends Controller {

    /*
     * 金币消耗换算成鱼雷，设定一个阈值，超过阈值和boss一样必掉，保证使用的多也能掉的多或者至少能掉
     * 金币余额和buff值对比作为一个系数
     * 设定一个幸运值，保证多少次能掉完，记录一个字段
     * 提示按白银鱼类提示，增加转化成三种鱼雷增加
     * user_id 玩家账号
     * consumed_number 打死鱼消耗的金币数
     * get_number 打死鱼获得的金币数
     * boss_multiple 鱼的倍数
     * cannon_multiple 炮倍
     * is_boss 是否是BOSS，是BOSS必掉
     * user_number 用户剩余金币数量
     */
    public function falling(Request $request){
        try {
            $data = $request->ajax();
            return $this->buyuJson(1, $data, 0);
            $data['is_boss'] = filter_var($data['is_boss'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $data['get_number'] = filter_var($data['get_number'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $data['user_number'] = filter_var($data['user_number'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $data['consumed_number'] = filter_var($data['consumed_number'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $data['boss_multiple'] = filter_var($data['boss_multiple'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $data['cannon_multiple'] = filter_var($data['cannon_multiple'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $data['venue'] = filter_var($data['venue'], FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE);
            $fallingModel = Falling::create([
                'acc' => $data['user_id'],
                'consumed_number' => $data['consumed_number'],
                'get_number' => $data['get_number'],
                'user_number' => $data['user_number'],
                'is_boss' => $data['is_boss']  ? 2 : 1,
                'boss_multiple' => $data['boss_multiple'],
                'cannon_multiple' => $data['cannon_multiple'],
                'venue' => $data['venue'],
                'name' => $data['fish_name']
            ]);
            $user = User::where('acc', $data['user_id'])->first();
            if($user){
                //没有buff值了，不用在管
                if($user['buff_num'] < 1){
                    return $this->buyuJson(1, null, 0);
                }
                $result = $this->countFalling($data, $user['buff_num']);
                if($result['number']){
                    //更新用户buff数量和临时掉落鱼雷数量
                    $user->update([
                        'buff_num'  => $user['buff_num'] - $result['number'],
                        'falling_numer'  => $user['falling_numer'] + $result['number'],
                    ]);
                    $fallingModel->update(['falling_numer' => $result['number']]);
                    return $this->buyuJson(0, $result, '恭喜您，一共掉落'.$result['number'].'个白银鱼雷');
                }
                return $this->buyuJson(1, $result, 0);
            }
            return $this->buyuJson(1, null, 0);
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }


    protected function countFalling($data = [], $buff = 0){
        $setting = config('setting');
        $useGlod = $data['consumed_number'];
        $cannon = $data['cannon_multiple'];
        /*
         * 必掉的几种情况：
         * 1、BOSS回调
         * 2、当前buff值 > 剩余金币价值
         * 3、消耗金币-得到金币 > 剩余金币 / 3
         */
        $win = false;
        //当前用户的剩余的真实金币
        $userGoldCurrent = $data['user_number'] + $data['get_number'];
        //计算用户当前剩余金币的鱼雷价值
        $currentGoldToTorpedo = round($userGoldCurrent / $setting['gold_scale'], 2);
        if ($useGlod > round($userGoldCurrent / 3)) {
            $win = true;
        }
        if ($buff >= $currentGoldToTorpedo) {
            $win = true;
        }
        if ($data['is_boss']) {
            $win = true;
        }
        if (!$win) {
            //不是必掉的情况，根据自身概率
            $cannonLimit = [
                ['min' => 0, 'max' => 300, 'rand' => 10],
                ['min' => 300, 'max' => 600, 'rand' => 20],
                ['min' => 600, 'max' => 2000, 'rand' => 30],
                ['min' => 2000, 'max' => 4000, 'rand' => 40],
                ['min' => 4000, 'max' => 6000, 'rand' => 45],
                ['min' => 6000, 'max' => 8000, 'rand' => 50],
                ['min' => 6000, 'max' => 1000000, 'rand' => 60]
            ];
            foreach ($cannonLimit as $limit) {
                if ($cannon > $limit['min'] && $cannon <= $limit['max']) {
                    $rand = mt_rand(1, 100);
                    if ($rand <= $limit['rand']) {
                        $win = true;
                    }
                    break;
                }
            }
        }
        //计算掉落数量
        $number = 0;//掉落数量
        $minBuff = 0;
        $maxBuff = 0;
        $percent = 0;
        if ($win) {
            $percent = round($useGlod / $userGoldCurrent, 2);
            //通过消耗金币占比（消耗金币/金币余额），定义掉落buff值占比（此次掉落buff数/剩余buff余额数）
            $buffLimit = [
                ['min' => 0, 'max' => 0.08, 'buff_min' => 0.01, 'buff_max' => 0.05],
                ['min' => 0.08, 'max' => 0.13, 'buff_min' => 0.05, 'buff_max' => 0.18],
                ['min' => 0.13, 'max' => 0.18, 'buff_min' => 0.1, 'buff_max' => 0.23],
                ['min' => 0.18, 'max' => 0.23, 'buff_min' => 0.15, 'buff_max' => 0.28],
                ['min' => 0.23, 'max' => 0.28, 'buff_min' => 0.20, 'buff_max' => 0.33],
                ['min' => 0.28, 'max' => 0.33, 'buff_min' => 0.25, 'buff_max' => 0.38],
                ['min' => 0.33, 'max' => 0.38, 'buff_min' => 0.30, 'buff_max' => 0.43],
                ['min' => 0.38, 'max' => 0.43, 'buff_min' => 0.35, 'buff_max' => 0.48],
                ['min' => 0.43, 'max' => 0.48, 'buff_min' => 0.40, 'buff_max' => 0.53],
                ['min' => 0.48, 'max' => 0.53, 'buff_min' => 0.45, 'buff_max' => 0.58],
                ['min' => 0.53, 'max' => 0.58, 'buff_min' => 0.50, 'buff_max' => 0.63],
                ['min' => 0.58, 'max' => 0.63, 'buff_min' => 0.55, 'buff_max' => 0.68],
                ['min' => 0.63, 'max' => 0.68, 'buff_min' => 0.60, 'buff_max' => 0.73],
                ['min' => 0.68, 'max' => 0.73, 'buff_min' => 0.65, 'buff_max' => 0.78],
                ['min' => 0.73, 'max' => 0.78, 'buff_min' => 0.70, 'buff_max' => 1],
                ['min' => 0.78, 'max' => 0.83, 'buff_min' => 0.75, 'buff_max' => 1.1],
                ['min' => 0.83, 'max' => 0.88, 'buff_min' => 0.80, 'buff_max' => 1.2],
                ['min' => 0.88, 'max' => 0.93, 'buff_min' => 0.85, 'buff_max' => 1.3],
                ['min' => 0.93, 'max' => 1.2, 'buff_min' => 0.95, 'buff_max' => 1.4],
            ];
            foreach ($buffLimit as $item) {
                if ($percent > $item['min'] && $percent <= $item['max']) {
                    $minBuff = ($buff * $item['buff_min']);
                    $maxBuff = ($buff * $item['buff_max']);
                    break;
                }
            }
            if(!$percent){
                $minBuff = ($buff * $buffLimit[0]['buff_min']);
                $maxBuff = ($buff * $buffLimit[0]['buff_max']);
            }
            //随机最终获得的掉落数值
            $minBuff = $minBuff <= 1 ? 1 : (int)$minBuff;
            $maxBuff = $maxBuff <= 1 ? 1 : (int)$maxBuff;
            $buffRand = mt_rand($minBuff, $maxBuff);
            $number = ($buffRand > $buff) ? $buff : $buffRand;
        }
        return ['number' => $number, 'win' => $win, 'minBuff' => $minBuff, 'maxBuff' => $maxBuff, 'percent' => $percent, 'pan' => round(($userGoldCurrent / 3))];
    }













}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Demand;
use App\Models\Jackpot;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use QL\QueryList;

class IndexController extends Controller
{

    public function index(Request $request)
    {
//        $data = $request->all();
//        $data['is_boss'] = filter_var($data['is_boss'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
//        $result = $this->fallingTest($data, 6.48);
//        return $this->buyuJson(1, $result, 0);
    }


    protected function fallingTest($data = [], $buff = 0)
    {
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
                ['min' => 0.93, 'max' => 1.2, 'buff_min' => 0.95, 'buff_max' => 1],
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


    //押注测试
    protected function stakeTest($torpedo = 0, $betFactor = 1, $numberFactor = 1)
    {
        //bet越大，单注的数量越多，上限值越高，  number越大，投注的份数越多，中奖的几率越大
        $percentage = [
            ['min' => 0, 'max' => 10, 'bet' => 0.6, 'number' => 15],
            ['min' => 10, 'max' => 50, 'bet' => 0.6, 'number' => 15],
            ['min' => 50, 'max' => 100, 'bet' => 0.6, 'number' => 15],
            ['min' => 100, 'max' => 200, 'bet' => 0.6, 'number' => 15],
            ['min' => 200, 'max' => 400, 'bet' => 0.6, 'number' => 15],
            ['min' => 400, 'max' => 700, 'bet' => 0.6, 'number' => 15],
            ['min' => 700, 'max' => 1100, 'bet' => 0.6, 'number' => 15],
            ['min' => 1100, 'max' => 1600, 'bet' => 0.6, 'number' => 15],
            ['min' => 1600, 'max' => 2200, 'bet' => 0.6, 'number' => 15],
            ['min' => 2200, 'max' => 3000, 'bet' => 0.6, 'number' => 15],
            ['min' => 3000, 'max' => 5000, 'bet' => 0.6, 'number' => 15],
            ['min' => 5000, 'max' => 10000000, 'bet' => 0.6, 'number' => 15]
        ];
        //最高中奖限制
        $rewardLimit = [
            ['min' => 0, 'max' => 50000, 'limit' => 2000],
            ['min' => 50000, 'max' => 60000, 'limit' => 3000],
            ['min' => 60000, 'max' => 70000, 'limit' => 10000],
            ['min' => 70000, 'max' => 80000, 'limit' => 15000],
            ['min' => 80000, 'max' => 90000, 'limit' => 20000],
            ['min' => 90000, 'max' => 100000, 'limit' => 25000],
            ['min' => 100000, 'max' => 110000, 'limit' => 28000],
            ['min' => 110000, 'max' => 120000, 'limit' => 30000],
            ['min' => 120000, 'max' => 130000, 'limit' => 35000],
            ['min' => 130000, 'max' => 140000, 'limit' => 40000],
            ['min' => 140000, 'max' => 150000, 'limit' => 45000],
            ['min' => 150000, 'max' => 160000, 'limit' => 48000],
            ['min' => 160000, 'max' => 10000000, 'limit' => 50000],
        ];
        //赔率（28个数字）
        $odds = [1000, 333, 166, 100, 66, 48, 36, 28, 22, 18, 16, 15, 14, 13, 13, 14, 15, 16, 18, 22, 28, 36, 48, 66, 100, 166, 333, 1000];
        $ofBet = 0;//投注数量百分比  （投注数量=单次兑换数量*投注数量百分比）
        $betNumber = 0;//投注份数(后期可以根据个人消费和ROI进行调节)
        foreach ($percentage as $percent) {
            if ($torpedo > $percent['min'] && $torpedo <= $percent['max']) {
                $ofBet = $percent['bet'] * $betFactor;
                $betNumber = $percent['number'] * $numberFactor;
                break;
            }
        }
        //计算实际投注数量
        $stakeNumber = round($torpedo * $ofBet, 3);
        //是否中奖
        $isHit = false;
        //总赔率
        $totalOdds = 0;
        for ($a = 0; $a < $betNumber; $a++) {
            //击中数字
            $hitNumber = rand(0, 9) + rand(0, 9) + rand(0, 9);
            //解密数字
            $decryptNumbers = rand(0, 9) + rand(0, 9) + rand(0, 9);
            if ($hitNumber == $decryptNumbers) {
                $isHit = true;
                $totalOdds += $odds[$hitNumber];
            }
        }
        //调控基数
        $coefficient = 80000;//后台设置,该值越大于奖池金额基数，则中大奖的人越多
        $jackpot = cache()->get('jackpot');//奖池金额基数,单位：白银鱼雷个数
        //根据当前奖池金额计算出奖池系数(奖池系数=奖池金额/调控系数)
        $regulation = round($jackpot / $coefficient, 3);
        //计算中奖金额
        $realityAmount = sprintf("%.2f", $totalOdds * ($stakeNumber / $betNumber) * $regulation);
        foreach ($rewardLimit as $limit) {
            if ($jackpot >= $limit['min'] && $jackpot < $limit['max']) {
                if ($realityAmount > $limit['limit']) {
                    $realityAmount = $limit['limit'];
                    break;
                }
            }
        }
        if ($realityAmount >= $torpedo) {
            $jackpot -= $realityAmount;
        } else {
            $jackpot += ($torpedo - $realityAmount);
        }
        cache()->set('jackpot', $jackpot);
        return $realityAmount;
    }


}

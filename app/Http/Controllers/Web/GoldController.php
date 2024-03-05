<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Airdrop;
use App\Models\Category;
use App\Models\Cost;
use App\Models\Demand;
use App\Models\Jackpot;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use QL\QueryList;

class GoldController extends Controller
{

    public function iframe(Request $request){
        try {
            $acc = $request->get('acc', '');
            $user = User::where('acc', $acc)->first();
            if($user){
                $setting = config('setting');
                //增加临时掉落鱼雷数量，为0也调用接口
                $torpedo = $this->updateTorpedo($user['acc'], $user['falling_numer']);
                if($torpedo){
                    //同步数据库
                    $torpedo['falling_numer'] = 0;
                    $user->update($torpedo);
                    return view('web.gold.iframe', compact('user', 'torpedo', 'setting'));
                }
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }


    //兑换
    public function update(Request $request){
        try {
            $data = $request->all();
            $user = User::where('acc', $data['acc'])->first();
            if($user){
                $verify = $this->verify($data['type'], $data['number'], $user);
                if(!$verify){
                    return $this->returnJson(1, null, '抱歉，当前鱼雷数量不足');
                }
                //增加金币接口
                $goldRes = $this->updateGold($data['acc'], $data['gold']);
                if($goldRes){
                    //减少鱼雷接口
                    $update = $this->updateTorpedo($user['acc'], $data['number'], $data['type'], 11);
                    if($update){
                        //根据鱼雷类型换算成白银鱼雷
                        $torpedo = $this->scaler($data['type'], $data['number']);
                        //增加兑换buff逻辑
                        $buff = $this->stake($torpedo);
                        $update['convert_total'] = $user['convert_total'] + $torpedo; //总的兑换量
                        $update['buff_num'] = $user['buff_num'] + $buff; //buff值
                        $update['buff_total'] = $user['buff_total'] + $buff; //总的buff值
                        $user->update($update);
                        //生成兑换记录
                        Cost::create([
                            'acc' => $data['acc'],
                            'uid' => $user['id'],
                            'type' => $data['type'],
                            'number' => $data['number'],
                            'redeem_number' => $data['gold'],
                            'group' => Cost::GROUP_1,
                        ]);
                        return $this->returnJson(0, null, '兑换成功，请稍后...');
                    }
                }
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }

    }








}

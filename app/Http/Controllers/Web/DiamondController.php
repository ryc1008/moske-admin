<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Airdrop;
use App\Models\Category;
use App\Models\Cost;
use App\Models\Demand;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use QL\QueryList;

class DiamondController extends Controller
{

    public function iframe(Request $request){
        try {
            $acc = $request->get('acc', '');
            $user = User::where('acc', $acc)->first();
            if($user){
                $setting = config('setting');
                //这里在渔场也可以调用，所有不能更新临时掉落的
                $torpedo = $this->updateTorpedo($user['acc']);
                if($torpedo){
                    //同步数据库
                    $user->update($torpedo);
                    return view('web.diamond.iframe', compact('user', 'torpedo', 'setting'));
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
                //增加钻石接口
                $diamondRes = $this->updateDiamond($data['acc'], $data['gold']);
                if($diamondRes){
                    //减少鱼雷接口
                    $update = $this->updateTorpedo($user['acc'], $data['number'], $data['type'], 11);
                    if($update){
                        //根据鱼雷类型换算成白银鱼雷
                        $torpedo = $this->scaler($data['type'], $data['number']);
                        $update['consume_total'] =  $user['consume_total'] + $torpedo;
                        $user->update($update);
                        //生成兑换记录
                        Cost::create([
                            'acc' => $data['acc'],
                            'uid' => $user['id'],
                            'type' => $data['type'],
                            'number' => $data['number'],
                            'redeem_number' => $data['gold'],
                            'group' => Cost::GROUP_2,
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

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Airdrop;
use App\Models\Category;
use App\Models\Demand;
use App\Models\User;
use Illuminate\Http\Request;

class AirdropController extends Controller
{

    public function index(){
        $time = time();
        return view('web.airdrop.index', compact('time'));
    }


    public function iframe(Request $request){
        try {
            $acc = $request->get('acc', '');
            $user = User::where('acc', $acc)->first();
            if($user){
                //增加临时掉落鱼雷数量，为0也调用接口
                $torpedo = $this->updateTorpedo($user['acc'], $user['falling_numer']);
                if($torpedo){
                    //同步数据库
                    $torpedo['falling_numer'] = 0;
                    $user->update($torpedo);
                    return view('web.airdrop.iframe', compact('acc', 'torpedo'));
                }
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }


    //空投鱼雷
    public function update(Request $request){
        try {
            $data = $request->all();
            if($data['number'] <= 0){
                return $this->returnJson(1, null, '请填写空投鱼雷数量');
            }
            $user = User::where('acc', $data['acc'])->first();
            if($user){
                $verify = $this->verify($data['type'], $data['number'], $user);
                if(!$verify){
                    return $this->returnJson(1, null, '抱歉，当前鱼雷数量不足');
                }
                //由于数据库和接口是一致性的，所以不需要单独查询，直接更新接口就行，不然空投了继续使用会出问题
                //更新自己鱼雷及接口
                $update = $this->updateTorpedo($data['acc'], $data['number'], $data['type'], 11);
                if($update){
                    $user->update($update);
                    //创建记录
                    Airdrop::create([
                        'acc_publish' => $data['acc'],
                        'type' => $data['type'],
                        'number' => $data['number'],
                        'name' => Airdrop::TYPE_TEXT[$data['type']],
                        'redeem_code' => redeem_code(),
                        'status' => Airdrop::STATUS_1
                    ]);
                    return $this->returnJson(0, null, '空投成功，请稍后...');
                }
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }
    }

    //空投记录
    public function record(Request $request){
        try {
            $acc = $request->get('acc', '');
            $user = User::where('acc', $acc)->first();
            if($user){
                $list = Airdrop::where('acc_publish', $acc)->where('status', Airdrop::STATUS_1)->get();
                return $this->returnJson(0, $list);
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }

    }

    //兑换
    public function redeem(Request $request){
        try {
            $code = $request->post('code', '');
            $acc = $request->post('acc', '');
            $user = User::where('acc', $acc)->first();
            if($user){
                $gif = Airdrop::where('redeem_code', $code)->where('status', Airdrop::STATUS_1)->first();
                if(!$gif){
                    return $this->returnJson(1, null, '兑换码错误或者已失效');
                }
                //更新兑换者鱼雷及接口
                $update = $this->updateTorpedo($user['acc'], $gif['number'], $gif['type']);
                if($update){
                    $user->update($update);
                    //更新空投记录
                    $gif->update(['status' => Airdrop::STATUS_2,  'acc_accept' => $acc]);
                    return $this->returnJson(0, null, '操作成功');
                }
            }
            return $this->returnJson(1, null, 'system error');
        } catch (\Throwable $e) {
            return $this->returnJson(1, null, $e->getMessage());
        }



    }



























    public function test(){
        return view('web.airdrop.test');
    }

    public function demo(){
        return view('web.airdrop.demo');
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Jackpot;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected $key = 'YOUXIPT';
    protected $target = [
        'torpedo_find' => 'http://175.27.250.69:1005/api/Torpedo/TorpedoByUid?',
        'torpedo_update' => 'http://175.27.250.69:1005/api/Torpedo/UpdateTorpedoByUid',
        'ticket_find' => 'http://175.27.250.69:1005/api/Ticket/GetTicketByUid?',
        'ticket_recharge' => 'http://175.27.250.69:1005/api/Ticket/UpdateTicket',
        'gold_recharge' => 'http://175.27.250.69:1005/api/GoldReCharge/UpdateGold',
        'diamond_recharge' => 'http://175.27.250.69:1005/api/DiamondReCharge/UpdateDiamond',
        'vip_recharge' => 'http://175.27.250.69:1005/api/VipExpertiseReCharge/UpdateExpertise',
    ];

    protected function returnJson($status = 0, $data = null, $message = null){
        $data = [
            "status" => $status,
            "data" => $data,
            "message" => $message ?? '操作成功'
        ];
        return response()->json($data);
    }

    protected function buyuJson($status = 0, $data = null, $message = null){
        $data = [
            "status" => $status,
            "data" => $data,
            "msg" => $message ?? 0
        ];
        return response()->json($data);
    }


    protected function client($name = '', $data = [], $method = 'GET'){
        $client = new Client();
        $timespan = time();
        $sign = md5($data['acc'] . $this->key . $timespan);
        $link = $this->target[$name];
        $data['timespan'] = $timespan;
        $data['sign'] = $sign;
        if($method == 'GET'){
            $link .= http_build_query($data);
            $result = $client->get($link)->getBody()->getContents();
        }else{
            $result = $client->post($link,  [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($data)
            ])->getBody()->getContents();
        }
        $result = json_decode($result, true);
        return $result;
    }



    protected function register($data){
        User::create(['acc' => $data['acc'], 'nickname' => $data['nickname'], 'player_id' => $data['player_id']]);
    }


    /**
     * 鱼雷BUFF逻辑
     * @param $torpedo 投注数量
     * @param $betFactor 控制最高奖值
     * @param $numberFactor 控制中奖几率
     * @return array
     */
    protected function stake($torpedo = 0, $betFactor = 1, $numberFactor = 1){
        $setting = config('setting');
        $jackpotInfo = Jackpot::where('acc', 'admin')->first();
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
        $coefficient = $setting['throw_torpedo'];//后台设置,该值越大于奖池金额基数，则中大奖的人越多
        $jackpot = $jackpotInfo['number'];//奖池金额基数,单位：白银鱼雷个数
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
        if($isHit){
            $jackpot -= $realityAmount;
        }else{
            $jackpot += $torpedo;
        }
        $jackpotInfo->update(['number' => $jackpot]);
        return $realityAmount;
    }



    //投注
    protected function betting($hight, $end, $probability){
        $prices = [
            ['i' => 1, 'k' => 1],
            ['i' => 2, 'k' => $probability / 2],
            ['i' => 3, 'k' => $probability],
            ['i' => 4, 'k' => 100 - $probability - 1 - ($probability / 2)]
        ];
        $obbs = [
            1 => $hight,
            2 => 2,
            3 => 1,
            4 => $end / 100,
        ];
        $gif = [];
        foreach ($prices as $key => $val){
            $gif[$val['i']] = $val['k'];
        }
        $total = array_sum($gif);
        $factor = 0;
        foreach ($gif as $key => $val){
            $rand = mt_rand(1, $total);
            if($rand <= $val){
                $factor = $obbs[$key];
                break;
            }else{
                $total -= $val;
            }
        }
        return $factor;
    }


    //根据鱼雷类型换算成白银鱼雷
    protected function scaler($type = 25, $number = 0){
        $setting = config('setting');
        switch ($type){
            case 25: //白银鱼雷
                $torpedo = $number;
                break;
            case 26: //黄金鱼雷
                $torpedo = $number * $setting['gold_torpedo_scale'];
                break;
            case 27: //钻石鱼雷
                $torpedo = $number * $setting['diamond_torpedo_scale'];
                break;
            default:
                $torpedo = $number;
                break;
        }
        return $torpedo;
    }


    //根据鱼雷类型判断鱼类数量
    protected function verify($type, $number, $user){
        switch ($type){
            case 25: //白银鱼雷
                $result = $user['torpedo_silver'] >= $number ? true : false;
                break;
            case 26: //黄金鱼雷
                $result = $user['torpedo_gold'] >= $number ? true : false;
                break;
            case 27: //钻石鱼雷
                $result = $user['torpedo_diamond'] >= $number ? true : false;
                break;
            default:
                $result = false;
                break;
        }
        return $result;
    }

    //buff 转化成三种鱼雷的数量
    protected function transform($number, $setting){
        $return = [];
        if($number >= $setting['diamond_torpedo_scale']){
            $diamond = floor($number / $setting['diamond_torpedo_scale']);
            $number = $number - ($diamond * $setting['diamond_torpedo_scale']);
            $return[] = ['type' => 27, 'number' => (int)$diamond];
        }
        if($number >= $setting['gold_torpedo_scale']){
            $gold = floor($number / $setting['gold_torpedo_scale']);
            $number = $number - ($gold * $setting['gold_torpedo_scale']);
            $return[] = ['type' => 26, 'number' => (int)$gold];
        }
        if($number){
            $return[] = ['type' => 25, 'number' => (int)$number];
        }
        return $return;
    }



    //更新鱼雷接口
    protected function updateTorpedo($acc = '', $number = 0, $type = 25, $option = 1){
        $result = $this->client('torpedo_update', [
            'acc' => $acc,
            'item_id' => $type, // 25白银 26黄金 27钻石
            'opType' => $option, //opType 1增加 11减少
            'num' => $number,
        ], 'POST');

        if($result['status'] == 200){
            $resultTorpedo = $result['data']['items'];
            return $this->getUserUpdateTorpedo($resultTorpedo);
        }
        return false;
    }

    //更新鱼雷接口 opType//1增加 11减少
    protected function updateGold($acc = '', $number = 0, $option = 1){
        $result = $this->client('gold_recharge', [
            'acc' => $acc,
            'opType' => $option, //opType 1增加 11减少
            'goldNum' => $number,
        ], 'POST');
        if($result['status'] == 200){
            return true;
        }
        return false;
    }

    //更新钻石接口 opType//1增加 11减少
    protected function updateDiamond($acc = '', $number = 0, $option = 1){
        $result = $this->client('diamond_recharge', [
            'acc' => $acc,
            'opType' => $option, //opType 1增加 11减少
            'diamondNum' => $number,
        ], 'POST');
        if($result['status'] == 200){
            return true;
        }
        return false;
    }

    //更新VIP等级接口 opType//1增加 11减少
    protected function updateVipExp($acc = '', $number = 0){
        $result = $this->client('vip_recharge', [
            'acc' => $acc,
            'diamondNum' => $number,
        ], 'POST');
        if($result['status'] == 200){
            return true;
        }
        return false;
    }


    protected function getUserUpdateTorpedo($data = []){
        $setting = config('setting');
        $return = [
            'torpedo_silver' => 0,
            'torpedo_gold' => 0,
            'torpedo_diamond' => 0,
            'silver_number' => 0,
        ];
        if(count($data)){
            foreach ($data as $item){
                if($item && isset($item['item_id'])){
                    if($item['item_id'] == 25){
                        $return['torpedo_silver'] = $item['item_count'];
                    }
                    if($item['item_id'] == 26){
                        $return['torpedo_gold'] = $item['item_count'];
                    }
                    if($item['item_id'] == 27){
                        $return['torpedo_diamond'] = $item['item_count'];
                    }
                }
            }
        }
        $return['silver_number'] = $return['torpedo_silver'] + $return['torpedo_gold'] * $setting['gold_torpedo_scale'] + $return['torpedo_diamond'] * $setting['diamond_torpedo_scale'];
        return $return;
    }
}

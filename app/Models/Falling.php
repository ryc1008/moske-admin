<?php

namespace App\Models;

class Falling extends Base
{
    const IS_BOSS_1 = 1;
    const IS_BOSS_2 = 2;

    const IS_BOSS_TEXT = [
        self::IS_BOSS_1 => '普通',
        self::IS_BOSS_2 => 'BOSS',
    ];


    const VENUE_1 = 1;
    const VENUE_2 = 2;
    const VENUE_3 = 3;
    const VENUE_6 = 6;
    const VENUE_8 = 8;
    const VENUE_9 = 9;

    const VENUE_TEXT = [
        self::VENUE_1 => '欢乐浅滩',
        self::VENUE_2 => '深海巨鳄',
        self::VENUE_3 => '大圣下凡',
        self::VENUE_6 => '武装巨鲨',
        self::VENUE_8 => '魔鲲降世',
        self::VENUE_9 => '圣兽宝藏',
    ];

    protected $fillable = [
        'id', 'acc', 'name', 'consumed_number', 'get_number', 'user_number',
        'falling_numer', 'is_boss', 'boss_multiple', 'cannon_multiple', 'venue', 'created_at', 'updated_at'
    ];

    protected function list($params = [], $fields = ['*'], $limit = 10)
    {
        $this->limit =  $limit ?: $this->limit;
        return $this->select($fields)
            ->where(function ($query) use ($params) {
                if (isset($params['kwd']) && $params['kwd']) {
                    $query->where('acc', 'like', '%' . $params['kwd'] . '%');
                }
                if (isset($params['boss']) && $params['boss']) {
                    $query->where('is_boss', $params['boss']);
                }
                if (isset($params['venue']) && $params['venue']) {
                    $query->where('venue', $params['venue']);
                }
                if (isset($params['fish']) && $params['fish']) {
                    $query->where('boss_multiple', $params['fish']);
                }
                if (isset($params['cannon']) && $params['cannon']) {
                    $query->where('cannon_multiple', $params['cannon']);
                }
            })
            ->orderBy('id', 'desc')
            ->paginate($this->limit);
    }


}

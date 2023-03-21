<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class BlogStatus extends Enum
{
    const PUBLIC =   1;
    const PRIVATE = 2;

    /**
     * @return string
     */
    public static function getDescription($value): string
    {
        switch ($value) {
            case self::PUBLIC:
                return 'Công khai';

            case self::PRIVATE:
                return 'Riêng tư';
            default:
                return '';
        }
    }

    public static function toArrayDescription()
    {
        $arr = [];

        foreach (self::getValues() as $val) {
            $arr[$val] = self::getDescription($val);
        }
        return $arr;
    }
}

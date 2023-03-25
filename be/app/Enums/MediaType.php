<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class MediaType extends Enum
{
    const IMAGE = 1;
    const VIDEO = 2;

    /**
     * @return string
     */
    public static function getDescription($value): string
    {
        switch ($value) {
            case self::IMAGE:
                return 'Ảnh';

            case self::VIDEO:
                return 'Video';
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

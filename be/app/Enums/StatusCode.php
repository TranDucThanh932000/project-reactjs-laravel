<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class StatusCode extends Enum
{
    const OK = 200;
    const CREATED = 201;
    const ACCEPTED = 202;
    const BAD_REQUEST = 400;
    const UNAUTHORIZED = 401;
    const VALIDATION_ERR = 402;
    const FORBIDDEN = 403;
    const NOT_FOUND = 404;
    const METHOD_NOT_ALLOWED = 405;
    const REQUEST_TIMEOUT = 408;
    const INTERNAL_SERVER_ERROR = 500;
    
    public static function getDescription($value): string
    {
        switch ($value) {
            case self::OK:
                return 'OK';
                break;
            case self::CREATED:
                return 'CREATED';
                break;
            case self::ACCEPTED:
                return 'ACCEPTED';
                break;
            case self::BAD_REQUEST:
                return 'BAD_REQUEST';
                break;
            case self::UNAUTHORIZED:
                return 'UNAUTHORIZED';
                break;
            case self::VALIDATION_ERR:
                return 'VALIDATION_ERR';
                break;
            case self::FORBIDDEN:
                return 'FORBIDDEN';
                break;
            case self::NOT_FOUND:
                return 'NOT_FOUND';
                break;
            case self::METHOD_NOT_ALLOWED:
                return 'METHOD_NOT_ALLOWED';
                break;
            case self::REQUEST_TIMEOUT:
                return 'REQUEST_TIMEOUT';
                break;
            case self::INTERNAL_SERVER_ERROR:
                return 'INTERNAL_SERVER_ERROR';
                break;
            default:
                return '';
                break;
        }
    }

    public static function toEnumArray()
    {
        $arr = [];
        foreach (self::getValues() as $val) {
            $arr[$val] = $val;
        }
        return $arr;
    }
}

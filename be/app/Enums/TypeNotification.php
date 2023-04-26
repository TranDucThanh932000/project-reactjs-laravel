<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class TypeNotification extends Enum
{
    const ADD_FRIEND = 1;
    const FOLLOW = 2;
    const LIKE_POST = 3;
}

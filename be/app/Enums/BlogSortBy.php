<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class BlogSortBy extends Enum
{
    const LIKE = 'blog_likes_count';
    const VIEW = 'view';
}

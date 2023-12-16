<?php

function on_the_nth_of_christmas($n) {
    $on_the = 'On the ';
    switch($n) {
        case 1:
            $on_the .= $n . 'st ';
            break;
        case 2:
            $on_the .= $n . 'nd ';
            break;
        case 3:
            $on_the .= $n . 'rd ';
            break;
        default:
            $on_the .= $n . 'th ';
            break;
    }
    return $on_the . 'day of Christmas, my true love sent to me' . PHP_EOL;
}

function lyric_for_nth_day($n) {
    $lyric = on_the_nth_of_christmas($n);
    switch($n) {
        case 12:
            $lyric .= 'Twelve ' . shell_exec('/flag1') . PHP_EOL;
        case 11:
            $lyric .= 'Eleven pipers piping' . PHP_EOL;
        case 10:
            $lyric .= 'Ten lords a-leaping' . PHP_EOL;
        case 9:
            $lyric .= 'Nine ladies dancing' . PHP_EOL;
        case 8:
            $lyric .= 'Eight maids a-milking' . PHP_EOL;
        case 7:
            $lyric .= 'Seven swans a-swimming' . PHP_EOL;
        case 6:
            $lyric .= 'Six geese a-laying' . PHP_EOL;
        case 5:
            $lyric .= 'Fiiiiiiiiiiiiiiiiive golden rings' . PHP_EOL;
        case 4:
            $lyric .= 'Four calling birds' . PHP_EOL;
        case 3:
            $lyric .= 'Three French hens' . PHP_EOL;
        case 2:
            $lyric .= 'Two turtledoves' . PHP_EOL;
            $lyric .= 'And a partridge in a pear tree' . PHP_EOL;
            break;
        case 1:
            $lyric .= 'A partridge in a pear tree' . PHP_EOL;
    }
    return $lyric;
}


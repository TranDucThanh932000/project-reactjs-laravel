<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chúc ngủ ngon</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            margin-top: 0;
            color: #333;
        }
        p {
            font-size: 18px;
            line-height: 1.5;
            color: #666;
        }
        .signature {
            text-align: center;
            margin-top: 40px;
            color: #999;
        }
        .image {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            position: relative;
        }
        .overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .text-left {
            text-align: left !important;
        }
        .m-0 {
            margin: 0 !important;
        }
        .img {
            width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-left m-0">{{ $time }}</h1>
        <h1 class="text-left m-0">{{ $date }}</h1>
        <div class="image">
            <img src="{{ $urlImg }}" class="img" alt="goodnight">
            <div class="overlay">
                <p>Chào bạn,</p>
                <p>{{ $content }}</p>
                <p>Chúc bạn ngủ ngon!</p>
                <div class="signature">- LKC -</div>
            </div>
        </div>
    </div>
</body>
</html>
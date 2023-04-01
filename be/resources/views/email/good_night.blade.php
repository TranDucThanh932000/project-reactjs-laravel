<body>
    <div class='container'>
        <div class='container__content'>
            <div class='container__svgBox'>
                <svg class='container__svg' version='1.2' baseProfile='tiny-ps' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 78 46' width='78' height='46'>
                    <g id='Infographic'>
                        <g id='&lt;Group&gt;'>
                            <path id='&lt;Compound Path&gt;' fill-rule='evenodd' style='fill: #0d0e0e' d='M78.02 28.38L78.02 28.92C78.02 29.58 77.48 30.12 76.82 30.12L71.15 30.12C71.44 30.76 71.61 31.47 71.61 32.23C71.61 35.01 69.35 37.27 66.57 37.27C63.78 37.27 61.52 35.01 61.52 32.23C61.52 31.47 61.69 30.76 61.99 30.12L54.71 30.12C54.45 38.57 47.53 45.34 39.01 45.34C30.5 45.34 23.57 38.57 23.31 30.12L16.04 30.12C16.33 30.76 16.5 31.47 16.5 32.23C16.5 35.01 14.24 37.27 11.46 37.27C8.67 37.27 6.41 35.01 6.41 32.23C6.41 31.47 6.58 30.76 6.88 30.12L1.21 30.12C0.54 30.12 0 29.58 0 28.92L0 28.38C0 27.72 0.54 27.18 1.21 27.18L23.49 27.18C24.59 20.13 30.36 14.64 37.54 13.98L37.54 8.88L24.1 8.88C23.44 8.88 22.9 8.34 22.9 7.67L22.9 7.14C22.9 6.48 23.44 5.94 24.1 5.94L37.54 5.94L37.54 1.14C37.54 0.48 38.08 -0.06 38.75 -0.06L39.28 -0.06C39.94 -0.06 40.48 0.48 40.48 1.14L40.48 5.94L53.92 5.94C54.58 5.94 55.13 6.48 55.13 7.14L55.13 7.67C55.13 8.34 54.58 8.88 53.92 8.88L40.48 8.88L40.48 13.98C47.66 14.64 53.44 20.14 54.54 27.18L76.82 27.18C77.48 27.18 78.02 27.72 78.02 28.38ZM13.57 32.23C13.56 31.06 12.62 30.12 11.46 30.12C10.29 30.12 9.35 31.06 9.35 32.23C9.35 33.39 10.29 34.33 11.46 34.33C12.62 34.33 13.56 33.39 13.57 32.23ZM51.79 29.62C51.77 22.57 46.07 16.86 39.01 16.85C31.96 16.86 26.25 22.57 26.24 29.62C26.25 36.68 31.96 42.39 39.01 42.4C46.07 42.39 51.77 36.68 51.79 29.62ZM68.67 32.23C68.67 31.06 67.73 30.12 66.57 30.12C65.4 30.12 64.46 31.06 64.46 32.23C64.46 33.39 65.4 34.33 66.57 34.33C67.73 34.33 68.67 33.39 68.67 32.23ZM48.45 29.31L48.45 30.78L29.57 30.78L29.57 29.31C29.57 24.1 33.8 19.87 39.01 19.87C44.23 19.87 48.45 24.1 48.45 29.31ZM45.34 27.84C44.67 24.96 42.1 22.81 39.01 22.81C35.93 22.81 33.35 24.96 32.68 27.84L45.34 27.84Z' />
                        </g>
                    </g>
                </svg>
            </div>
            <div class='container__title' style="margin-left: 20px;">
                <h1 class='container__subTitle'>{{ $date }}</h1>
                <h1 class='container__mainTitle' style="color:pink;">CHÚC BÉ NGỦ NGON</h1>
            </div>
        </div>
    </div>
</body>

<style>
/* Global Variables */
:root {
    --color1: #d9e2e3;
    --color2: #ffffff;
    --color3: #0e0f0f;
    --color4: #868787;
}

/* Reset Default Settings */
* {
    box-sizing: border-box;
    margin: 0;
}

body {
    background-color: var(--color1);
    min-height: 100vh;
    font-family: 'Open Sans', sans-serif;

    /* Flex */
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 700px;
    height: 450px;
    overflow: hidden;
    box-shadow: rgba(27,30,30,0.3) 0px 5px 12px;
    
    /* Background */
    background-image: url(https://raw.githubusercontent.com/mohammadjarabah/codepen-assets/main/pens/rNGOBXq/images/img.jpg);
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;

    /* Flex */
    display: flex;
    align-items: center;
}

.container__content {
    width: 50%;
    height: 100%;

    /* Position */
    position: relative;
    z-index: 0;

    /* Flex */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container__content::before {
    background-color: var(--color2);
    width: 130%;
    height: 100%;
    transform: skewX(-20deg);

    content: '';
    position: absolute;
    top: 0;
    right: 0;
    z-index: -1;
}

.container__svgBox {
    display: block;
    width: 50px;
    height: 50px;
    margin: 35px 0 20px;
    border-radius: 50%;
    position: relative;

    /* Flex */
    display: flex;
    justify-content: center;
    align-items: center;
}

.container__svg {
    margin-top: -7px;
}

.container__svgBox::before {
    background-color: var(--color3);
    width: 70px;
    height: 2px;

    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(calc(-100% - 10px), -50%);
}

.container__svgBox::after {
    background-color: var(--color3);
    width: 70px;
    height: 2px;

    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(calc(100% + 10px), -50%);
}

.container__title {
    color: var(--color3);
    width: fit-content;

    /* Flex */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container__mainTitle {
    font-family: 'Oswald', sans-serif;
    font-size: 45px;
    font-weight: 500;
}

.container__subTitle {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 3px;
}

.container__subTitle:first-of-type {
    align-self: flex-end;
}

.container__subTitle:last-of-type {
    align-self: flex-start;
}

.container__desc {
    color: var(--color4);
    max-width: 271px;
    padding-right: 20px;
    margin-top: 35px;
    font-size: 11px;
    line-height: 1.8;
}
</style>
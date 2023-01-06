//Theme

let theme = 'light';

if (window.matchMedia) {
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
            theme = event.matches ? 'dark' : 'light';
            document.body.className = theme;
        });

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
    } else {
        theme = 'light';
    }

    document.body.className = theme;
}

//Snowfall

const d = new Date();

if (d.getMonth() < 2 || d.getMonth() > 10) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js';

    script.onload = function () {
        const script = document.createElement('script');
        script.src = './js/snowfall.js';

        document.body.appendChild(script);
    };

    document.head.appendChild(script);
}

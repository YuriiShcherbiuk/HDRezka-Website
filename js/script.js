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

if (
    (d.getMonth() === 11 && d.getDate() > 20) ||
    (d.getMonth() === 0 && d.getDate() < 11)
) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js';

    script.onload = function () {
        const script = document.createElement('script');
        script.src = './js/animation.js';

        document.body.appendChild(script);
    };

    document.head.appendChild(script);
}

//Button

const octokit = new Octokit();

octokit
    .request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'OWNER',
        repo: 'REPO',
    })
    .then(() => {
        console.log('s');
    })
    .catch(() => {
        console.log('e');
    });

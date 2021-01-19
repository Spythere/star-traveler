const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const Particle = (x, y, r) => {
    let posX = x;
    let posY = y;
    let posZ = Math.random();

    let blurScale, sX, sY;

    let radius = r;
    let maxSize, minSize, velZ, color;

    const generateValues = () => {
        maxSize = Math.random() * (5.5 - 3) + 3;
        minSize = Math.random() * (0.45 - 0.025) + 0.025;
        velZ = Math.random() * (0.01 - 0.001) + 0.001;

        color = `hsl(${Math.floor(Math.random() * (220 - 150) + 150)}, 100%, 50%)`
    }

    generateValues();

    const self = {
        render() {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(sX, sY, radius, 0, Math.PI * 2);
            ctx.shadowColor = color;
            ctx.shadowBlur = blurScale;
            ctx.fill();
        },

        update() {
            posZ -= velZ;
            
            sX = posX / posZ;
            sY = posY / posZ;

            blurScale = scale(posZ, 0, 1, 5, 25);

            radius = scale(posZ, 0, 1, maxSize, minSize); 

             if (posZ < 0.005) {
                 generateValues();
                 posZ = 1;
            }
        }
    }

    return self;
}

let particleList = new Array(300);

function load() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ctx.globalCompositeOperation = "mutliply";
    
    particleList = particleList.fill(0).map(v => {
        const rX = Math.random() * canvas.width - canvas.width / 2;
        const rY = Math.random()  * canvas.height - canvas.height / 2;


        return Particle(rX, rY, Math.random() * 3 + 0.2);
    })

    listen();
    render();
}

function render() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    for (let i = 0; i < particleList.length; i++) {
        particleList[i].update();
        particleList[i].render();
    }

    ctx.restore();

    window.requestAnimationFrame(render);
}

function listen() {
    window.addEventListener('resize', e => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    })
}

load();
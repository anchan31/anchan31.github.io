let highestZ = 1;

class Paper {
    constructor() {
        this.holdingPaper = false;
        this.mouseTouchX = 0;
        this.mouseTouchY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.velX = 0;
        this.velY = 0;
        this.rotation = Math.random() * 30 - 15;
        this.currentPaperX = 0;
        this.currentPaperY = 0;
        this.rotating = false;
    }

    init(paper) {
        // Throttled move handler for better performance
        let lastMoveTime = 0;
        const moveHandler = (e) => {
            const now = Date.now();
            if (now - lastMoveTime < 16) return; // Limit to ~60fps
            lastMoveTime = now;

            if (e.touches) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            } else {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }

            if (!this.rotating) {
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }

            const dirX = this.mouseX - this.mouseTouchX;
            const dirY = this.mouseY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            
            if (dirLength > 0) {
                const dirNormalizedX = dirX / dirLength;
                const dirNormalizedY = dirY / dirLength;
                const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
                let degrees = 180 * angle / Math.PI;
                degrees = (360 + Math.round(degrees)) % 360;
                
                if (this.rotating) {
                    this.rotation = degrees;
                }
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                
                // Use transform3d for hardware acceleration
                paper.style.transform = `translate3d(${this.currentPaperX}px, ${this.currentPaperY}px, 0) rotateZ(${this.rotation}deg)`;
            }
        };

        const startHandler = (e) => {
            e.preventDefault();
            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            if (e.touches) {
                this.mouseTouchX = e.touches[0].clientX;
                this.mouseTouchY = e.touches[0].clientY;
                this.prevMouseX = this.mouseTouchX;
                this.prevMouseY = this.mouseTouchY;
            } else {
                this.mouseTouchX = e.clientX;
                this.mouseTouchY = e.clientY;
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }

            if (e.button === 2 || (e.touches && e.touches.length > 1)) {
                this.rotating = true;
            }
        };

        const endHandler = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        // Use passive listeners where possible for better scroll performance
        document.addEventListener('mousemove', moveHandler, { passive: true });
        document.addEventListener('touchmove', moveHandler, { passive: false });
        paper.addEventListener('mousedown', startHandler);
        paper.addEventListener('touchstart', startHandler, { passive: false });
        window.addEventListener('mouseup', endHandler, { passive: true });
        window.addEventListener('touchend', endHandler, { passive: true });
    }
}

// Optimized initialization with requestAnimationFrame
const initializePapers = () => {
    const papers = document.querySelectorAll('.paper');
    papers.forEach(paper => {
        const p = new Paper();
        p.init(paper);
    });
};

// Wait for DOM content to load before initializing
document.addEventListener('DOMContentLoaded', initializePapers);

// Heart click handler with debouncing
let clickTimeout;
document.addEventListener('click', function(e) {
    if (e.target.closest('.paper.heart')) {
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
            window.location.href = "/Scene3/Merijaan.html";
        }, 100);
    }
});

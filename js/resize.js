const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const v = Math.min(entry.contentRect.width, entry.contentRect.height);
        document.querySelector('.logo').style.fontSize = v * 0.12 + 'px';

        document.querySelector('.logo svg').style.cssText = `
        max-width: ${v * 0.15}px;
        max-height: ${v * 0.15}px;
        margin-left: ${v * 0.015}px;
        padding: ${v * 0.015}px ${v * 0.015}px ${v * 0.015}px 0;
        `;

        document.querySelector('.info').style.fontSize = v * 0.06 + 'px';

        document.querySelector('.telegram').style.cssText = `
        font-size: ${v * 0.06}px;
        padding: ${v * 0.0225}px ${v * 0.045}px;
        border-radius: ${v * 0.03}px;
        `;

        document.querySelector('.telegram svg').style.cssText = `
        max-width: ${v * 0.09}px;
        max-height: ${v * 0.09}px;
        margin-left: ${v * 0.015}px;
        padding: ${v * 0.015}px ${v * 0.015}px ${v * 0.015}px 0;
        `;
    }
});

resizeObserver.observe(document.querySelector('.sex'));

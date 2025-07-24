(() => {
    'use strict';
    const e = { API_KEY: { key: 'api_key', defaultValue: '' }, APP_ID: { key: 'appId', defaultValue: '' }, POWER_ON: { key: 'power_on', defaultValue: !0 }, TIKTOK: { key: 'tiktok', defaultValue: { delayClick: 500, delaySwipe: 15, loop: !0, isActive: !0 } }, FUNCAPTCHA: { key: 'funcaptcha', defaultValue: { delayClick: 100, loop: !0, isActive: !0, maxImageCaptcha: 25 } }, ZALO: { key: 'zalo', defaultValue: { delayClick: 100, loop: !0, isActive: !0 } }, SHOPEE: { key: 'shopee', defaultValue: { delaySwipe: 15, loop: !0, isActive: !0 } }, RECAPTCHAV2: { key: 'reCaptchav2', defaultValue: { delayClick: 500, loop: !0, isActive: !0, useToken: !1 } }, AMZN: { key: 'amzn', defaultValue: { delayClick: 100, loop: !0, isActive: !0 } }, GEETEST: { key: 'geetest', defaultValue: { delayClick: 500, delaySwipe: 15, loop: !0, isActive: !0 } }, SLIDE_ALL: { key: 'slide_all', defaultValue: { delaySwipe: 15, loop: !0, isActive: !0 } }, HCAPTCHA: { key: 'hcaptcha', defaultValue: { delayClick: 500, delaySwipe: 15, loop: !0, isActive: !0 } }, CLOUDFLARE: { key: 'cloudflare', defaultValue: { delayClick: 2e3, isActive: !0 } } };
    async function t(e, t, o) {
        const a = 'undefined' != typeof browser ? browser.runtime : chrome.runtime;
        try {
            return await new Promise((n, r) => {
                a.sendMessage({ source: e, type: t, data: o }, (e) => {
                    a.lastError ? r(new Error(`Error sending message: ${a.lastError.message}`)) : n(e);
                });
            });
        } catch (e) {
            throw (console.error(`[messageHelpers] Error in sending message: ${e.message}`), e);
        }
    }
    const o = async (e, t) => {
        const o = 'undefined' != typeof browser ? browser.storage.local : chrome.storage.local,
            a = 'undefined' != typeof browser ? browser.runtime : chrome.runtime;
        try {
            const n = await o.get([e]);
            if (a.lastError) throw new Error(`Error retrieving ${e}: ${a.lastError.message}`);
            return null != n[e] ? n[e] : t;
        } catch (t) {
            throw (console.error(`[storageHelpers] Error retrieving ${e}:`, t), t);
        }
    };
    Promise.resolve();
    async function a(e) {
        return new Promise((t) => setTimeout(t, e));
    }
    function n(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'success',
            o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            a = document.getElementById('captcha-message');
        a || ((a = document.createElement('div')), (a.id = 'captcha-message'), (a.style.zIndex = '99999999'), (a.style.padding = '3px 3px'), (a.style.borderRadius = '3px'), (a.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)'), (a.style.fontSize = '10px'), (a.style.fontWeight = '600'), (a.style.fontFamily = 'Arial, sans-serif'), (a.style.textAlign = 'center'), (a.style.whiteSpace = 'nowrap'), (a.style.color = 'white'), (a.style.top = '1px'), o && o.parentElement ? ((a.style.position = 'absolute'), (a.style.left = '2px'), o.parentElement.appendChild(a)) : ((a.style.position = 'fixed'), (a.style.left = '1px'), document.body.appendChild(a)));
        const n = { success: 'linear-gradient(90deg, #6a11cb,rgb(191, 37, 252))', error: 'linear-gradient(90deg, #ff416c, #ff4b2b)', warning: 'linear-gradient(90deg, #ff9a44, #fc6076)', info: 'linear-gradient(90deg, #17a2b8, #138496)' };
        ((a.innerText = '[OMOcaptcha.com] ' + e), (a.style.background = n[t] || n.success), (a.style.display = 'block'));
    }
    async function r(e) {
        console.log('Vao createTask utils');
        try {
            const o = await t('SOURCE', 'createTask', e);
            return o || (console.error('No response from createTask'), '');
        } catch (e) {
            return (console.error('Failed to create task:', e), '');
        }
    }
    async function i(e, o, a) {
        const n = JSON.stringify({ clientKey: e, taskId: o });
        try {
            const e = await t('SOURCE', 'getTaskResult', { data: n, timeWait: a });
            return e ? ('fail' === e.status ? (console.error('API error:', e), { errorDescription: e.errorDescription }) : e.solution ? e.solution : e.type ? e : (console.error('Invalid API response: missing solution'), null)) : (console.error('No result returned from getTaskResult'), null);
        } catch (e) {
            return (console.error('Failed to get task result:', e), null);
        }
    }
    let s, c, l, d, u;
    console.log('Run shopee...', window.location.href);
    let p = !1,
        h = [];
    async function f() {
        console.log('[shopee] Da den captchaSlide()');
        var e = '';
        let t = document.querySelector('[role="dialog"] [id*="captchaMask"]');
        n('Captcha slide', 'red', t);
        for (var o = 0; o < 30; o++) {
            (n('Get image...', 'red', t), await a(1e3));
            var s = document.querySelector('[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(1) > img');
            if (s && e !== s.src) {
                e = s.src;
                var l = document.querySelector('[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(2) > img');
                n('Create task...', 'red', t);
                const o = JSON.stringify({ clientKey: c, task: { type: 'ShopeeSliderWebTask', typeCaptcha: '', imageBase64s: [l.src, e] } }),
                    a = await r(o);
                if (!a || a.error) {
                    if ((n(a ? a.errorDescription : 'No response', 'red', t), d)) {
                        await v(l, 1);
                        continue;
                    }
                    return;
                }
                {
                    n('Get result...', 'red', t);
                    const o = await i(c, a.taskId, 30);
                    if (!o || o.errorDescription) {
                        e = '';
                        if ((n(o ? o.errorDescription : 'No result from API', 'red', t), d)) {
                            await v(l, 1);
                            continue;
                        }
                        return;
                    }
                    let r = parseInt(o.end.x, 10);
                    if ((n('Solving...', 'red', t), await v(l, r), !d)) return;
                }
            }
        }
    }
    async function y() {
        console.log('[shopee] Đã vào captchaSlide_new');
        var e = '';
        let t = document.querySelector('[id*="NEW_CAPTCHA"] [id*="captchaMask"]');
        n('Captcha slide new', 'red', t);
        for (var o = 0; o < 30; o++) {
            (n('Get image...', 'red', t), await a(600 + 800 * Math.random()));
            const o = document.querySelector('[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(1) > img'),
                s = document.querySelector('[id*="sliderContainer"]'),
                l = document.querySelector('[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(2) > img');
            if (o && s && l) {
                if (e !== o.src) {
                    ((e = o.src), n('Create task...', 'red', t));
                    const u = JSON.stringify({ clientKey: c, task: { type: 'ShopeeSliderWebTask', typeCaptcha: 'rotate', imageBase64s: [l.src, e] } }),
                        p = await r(u);
                    if (!p || p.error) {
                        if ((n(p ? p.errorDescription : 'No response', 'red', t), console.warn('[shopee] Không lấy được taskId từ API'), d)) continue;
                        return;
                    }
                    (h.push(p.taskId), n('Get result...', 'red', t));
                    const f = await i(c, p.taskId, 30);
                    if (!f || f.errorDescription) {
                        (console.warn('[shopee] Lỗi server hoặc rỗng, thử lại'), (e = ''));
                        if ((n(f ? f.errorDescription : 'No result from API', 'red', t), d)) continue;
                        return;
                    }
                    if (!f.point || !f.point.x || !f.point.y) {
                        if ((console.error('[shopee] API trả về point không hợp lệ:', f), d)) continue;
                        return;
                    }
                    let y = parseFloat(f.point.x),
                        g = parseFloat(f.point.y);
                    const m = o.getBoundingClientRect(),
                        v = m.width / o.naturalWidth,
                        E = m.height / o.naturalHeight,
                        A = m.left + y * v,
                        C = m.top + g * E;
                    if ((console.log(`[shopee] API point=(${y},${g}), scale=(${v},${E}), targetScreen=(${A},${C})`), n('Solving...', 'red', t), await w(s, l, A, C), await a(3e3), location.href.includes('/verify/captcha?anti_bot_tracking_id') && (console.log('[shopee] Vẫn còn captcha, gửi report'), await k(!1)), !d)) return;
                }
            } else console.warn('[shopee] Không tìm thấy phần tử cần thiết');
        }
    }
    function g(e) {
        return !!document.querySelector(e);
    }
    async function m(e, t) {
        const o = Date.now() + t;
        for (; Date.now() < o; ) {
            for (const t of e) {
                if (document.querySelector(t)) return !0;
            }
            await a(500);
        }
        return !1;
    }
    function v(e, t) {
        return new Promise((o, a) => {
            if (!e) return (console.error('Element not found'), void a('Element not found'));
            function n() {
                const t = e.getBoundingClientRect();
                return { centerX: t.left + t.width / 2, centerY: t.top + t.height / 2 };
            }
            const r = new DataTransfer();
            function i(t, o, a) {
                const n = { bubbles: !0, cancelable: !0, clientX: o, clientY: a, dataTransfer: r, ...(arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}) },
                    i = t.includes('drag') ? new DragEvent(t, n) : new MouseEvent(t, n);
                e.dispatchEvent(i);
            }
            const s = n(),
                c = s.centerX + t;
            (i('pointerenter', s.centerX, s.centerY), i('mouseover', s.centerX, s.centerY), i('mousedown', s.centerX, s.centerY), i('dragstart', s.centerX, s.centerY));
            let l = s.centerX,
                d = 10,
                u = 3;
            !(function e() {
                const a = n();
                if (Math.abs(a.centerX - c) <= 1)
                    return void setTimeout(() => {
                        (i('dragend', a.centerX, a.centerY), i('mouseup', a.centerX, a.centerY), o());
                    }, 1e3);
                (c - a.centerX > t / 4 ? ((d = 10), (u = 3)) : ((d = 1), (u = 10)), (l += d * Math.sign(c - a.centerX)));
                const r = a.centerY;
                (i('mousemove', l, r), i('drag', l, r), setTimeout(e, u));
            })();
        });
    }
    async function w(e, t, o, a) {
        if (!e || !t) return void console.error('[shopee] ❌ Không tìm thấy phần tử để kéo');
        function n(e) {
            const t = e.getBoundingClientRect();
            return { x: t.left + t.width / 2, y: t.top + t.height / 2 };
        }
        const r = (e) => new Promise((t) => setTimeout(t, e)),
            i = new DataTransfer();
        function s(t, o, a) {
            const n = t.includes('drag') ? new DragEvent(t, { bubbles: !0, cancelable: !0, clientX: o, clientY: a, dataTransfer: i }) : new MouseEvent(t, { bubbles: !0, cancelable: !0, clientX: o, clientY: a });
            e.dispatchEvent(n);
        }
        const c = n(e);
        (s('pointerenter', c.x, c.y), s('mouseover', c.x, c.y), await r(50 + 150 * Math.random()), s('mousedown', c.x, c.y), s('dragstart', c.x, c.y));
        let l = c.x,
            d = c.y,
            u = 1,
            p = 0;
        for (console.log(`[shopee] 🟢 Kéo từ (${c.x}, ${c.y}) đến (${o}, ${a})`); ; ) {
            const e = n(t),
                i = o - e.x,
                c = a - e.y,
                h = Math.sqrt(i * i + c * c);
            if (1 === u && h < 5) {
                console.log('[shopee] 🟠 Phase 1: Overshoot +50px');
                const e = 50;
                ((l += (i / h) * e), (d += (c / h) * e), s('mousemove', l, d), s('drag', l, d), (u = 2), await r(10 + 20 * Math.random()));
                continue;
            }
            if (2 === u) {
                console.log('[shopee] 🔵 Phase 2: Rollback -50px');
                const e = -50;
                ((l += (i / h) * e), (d += (c / h) * e), s('mousemove', l, d), s('drag', l, d), (u = 3), await r(10 + 20 * Math.random()));
                continue;
            }
            if (3 === u && h < 3) {
                (console.log(`[shopee] ✅ Snap cuối: cách ${h.toFixed(2)}px`), (l += i), (d += c), s('mousemove', l, d), s('drag', l, d));
                break;
            }
            let f;
            f = h > 50 ? 6 + 1.5 * Math.random() : h > 20 ? 3 + 1 * Math.random() : 1.5 + 0.5 * Math.random();
            const y = 0.5 + Math.random(),
                g = Math.sin((p / 300) * Math.PI) * y * 5;
            if (((l += (i / h) * f + 0.5 * (Math.random() - 0.5)), (d += (c / h) * f + g + 0.5 * (Math.random() - 0.5)), s('mousemove', l, d), s('drag', l, d), p % 10 == 0 && Math.random() < 1)) {
                (s('mousemove', l + 4 * (Math.random() - 0.5), d + 4 * (Math.random() - 0.5)), await r(10 + 30 * Math.random()));
            }
            let m;
            if (((m = h > 50 ? 10 + 10 * Math.random() : 10 + 20 * Math.random()), await r(m), p++, p > 300)) {
                console.warn('[shopee] ⚠️ Max step, dừng để tránh vòng lặp vô tận');
                break;
            }
        }
        (await r(10 + 50 * Math.random()), s('dragend', l, d), s('mouseup', l, d), console.log('[shopee] 🟢 Đã nhả chuột xong'));
    }
    async function k() {
        let e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if ((console.log('Đang check resolvedTaskIds', h), 0 === h.length)) return;
        const o = { taskIds: h, result: e };
        try {
            await t('SHOPEE', 'reportTask', o);
        } catch (e) {
            console.error('Failed to send report:', e);
        } finally {
            h = [];
        }
    }
    (new MutationObserver(async (e, t) => {
        await (async function (e) {
            if (s && u && c && 'YOUR_CLIEN_KEY' !== c) {
                console.log('[shopee] handleElementMutation');
                for (const t of e)
                    if ('childList' === t.type) {
                        const e = document.querySelector('[role="dialog"] [id*="captchaMask"]'),
                            t = document.querySelector('[id*="NEW_CAPTCHA"] [id*="captchaMask"]');
                        if (e || t) {
                            if ((console.log('[shopee] Tim thay targetElement'), !p)) {
                                if (!c) return void console.log('Không tìm thấy API_KEY');
                                ((p = !0),
                                    await a(1e3),
                                    m(['[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(1) > img', '[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(2) > img', '[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(1) > img', '[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(2) > img'], 1e4).then(async (e) => {
                                        if (e)
                                            for (var t = 0; t < 20; t++) {
                                                if (g('[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(1) > img') && g('[role="dialog"] [id*="captchaMask"] div > div:nth-of-type(2) > img')) {
                                                    await f();
                                                    break;
                                                }
                                                if (g('[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(1) > img') && g('[id*="NEW_CAPTCHA"] [id*="captchaMask"] div > div:nth-of-type(2) > img')) {
                                                    await y();
                                                    break;
                                                }
                                                await a(500);
                                            }
                                    }));
                            }
                        } else (console.log('[shopee] Khong tim thay targetElement'), (p = !1));
                    }
            }
        })(e);
    }).observe(document.body, { childList: !0, subtree: !0 }),
        (async () => {
            await (async function () {
                ((s = await o(e.POWER_ON.key, e.POWER_ON.defaultValue)), (c = await o(e.API_KEY.key, e.API_KEY.defaultValue)));
                const t = await o(e.SHOPEE.key, e.SHOPEE.defaultValue);
                ((l = t.delaySwipe), (d = t.loop), (u = t.isActive));
            })();
        })());
})();

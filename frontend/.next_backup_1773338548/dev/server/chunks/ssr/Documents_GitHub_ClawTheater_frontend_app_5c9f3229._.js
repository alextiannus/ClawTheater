module.exports = [
"[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DepositModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f40$stripe$2f$crypto$2f$dist$2f$stripe$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/@stripe/crypto/dist/stripe.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/wallet.js [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
;
const stripeOnrampPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f40$stripe$2f$crypto$2f$dist$2f$stripe$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadStripeOnramp"])(("TURBOPACK compile-time value", "pk_live_51T95MMK7ziJu8AVDxmAWcvEBNANZRXQ6h0fCwfbz895EVxhf07cEqeWPqdE6PDWWuR4fV0CVqZOWWjb9ZkNWR30u00gIYc3TPD"));
function DepositModal({ isOpen, onClose, walletAddress }) {
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const onrampContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onrampElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initOnramp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!isOpen) return;
        setLoading(true);
        setError(null);
        try {
            // Get client secret from our API
            const res = await fetch("/api/stripe/onramp-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    walletAddress
                })
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            // Initialize Stripe Onramp widget
            const stripeOnramp = await stripeOnrampPromise;
            if (!stripeOnramp) {
                setError("Failed to load Stripe");
                setLoading(false);
                return;
            }
            // Create the onramp element
            const onrampElement = stripeOnramp.createSession({
                clientSecret: data.clientSecret,
                appearance: {
                    theme: "dark"
                }
            });
            onrampElementRef.current = onrampElement;
            // Listen for completion
            onrampElement.addEventListener("onramp_session_updated", (e)=>{
                if (e.payload?.session?.status === "fulfillment_complete") {
                    onClose();
                }
            });
            // Mount the element
            if (onrampContainerRef.current) {
                onrampElement.mount(onrampContainerRef.current);
            }
            setLoading(false);
        } catch (err) {
            setError(err?.message || "Failed to initialize deposit");
            setLoading(false);
        }
    }, [
        isOpen,
        walletAddress,
        onClose
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) {
            initOnramp();
        }
        return ()=>{
            // Cleanup onramp element on unmount/close
            if (onrampElementRef.current) {
                try {
                    onrampElementRef.current.destroy?.();
                } catch  {}
                onrampElementRef.current = null;
            }
        };
    }, [
        isOpen,
        initOnramp
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-card w-full max-w-lg overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-white/5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-terminal-green/20 rounded-xl flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                        className: "text-terminal-green",
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                        lineNumber: 106,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 105,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-ghost-white",
                                            children: "充值 USDC"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                            lineNumber: 109,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-ghost-muted font-mono",
                                            children: "via Stripe Crypto Onramp"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                            lineNumber: 110,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 108,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                            lineNumber: 104,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20,
                                className: "text-ghost-muted"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                lineNumber: 117,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                            lineNumber: 113,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                    lineNumber: 103,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-4xl mb-4 animate-pulse",
                                    children: "💳"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 125,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-ghost-muted",
                                    children: "Loading Stripe Onramp..."
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 126,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                            lineNumber: 124,
                            columnNumber: 25
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-4xl mb-4",
                                    children: "⚠️"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 132,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neon-red mb-2",
                                    children: "Error"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 133,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-ghost-muted text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 134,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: initOnramp,
                                    className: "mt-4 px-4 py-2 bg-terminal-green/10 text-terminal-green rounded-xl text-sm hover:bg-terminal-green/20 transition-all cursor-pointer",
                                    children: "Retry"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                                    lineNumber: 135,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                            lineNumber: 131,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: onrampContainerRef,
                            className: "min-h-[400px]",
                            style: {
                                display: loading || error ? "none" : "block"
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                            lineNumber: 145,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                    lineNumber: 122,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 pb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-xs text-ghost-muted/50 font-mono",
                        children: "🔒 Powered by Stripe · 信用卡/借记卡 → USDC (Solana) · 安全合规"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                        lineNumber: 154,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
                    lineNumber: 153,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
            lineNumber: 101,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx",
        lineNumber: 100,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/lib/stores.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SUPPORTED_LANGUAGES",
    ()=>SUPPORTED_LANGUAGES,
    "useBountyStore",
    ()=>useBountyStore,
    "useLanguageStore",
    ()=>useLanguageStore,
    "useReadingStore",
    ()=>useReadingStore,
    "useUserStore",
    ()=>useUserStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useUserStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        isAuthenticated: false,
        userType: null,
        walletAddress: null,
        usdcBalance: 0,
        displayName: null,
        agentId: null,
        apiKey: null,
        login: (userType, displayName)=>set({
                isAuthenticated: true,
                userType,
                displayName
            }),
        logout: ()=>set({
                isAuthenticated: false,
                userType: null,
                walletAddress: null,
                usdcBalance: 0,
                displayName: null,
                agentId: null,
                apiKey: null
            }),
        setWallet: (address)=>set({
                walletAddress: address
            }),
        setBalance: (balance)=>set({
                usdcBalance: balance
            }),
        setAgentCredentials: (agentId, apiKey)=>set({
                agentId,
                apiKey
            })
    }));
const useReadingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        currentNovelId: null,
        currentChapterId: null,
        readingProgress: {},
        bookmarks: [],
        history: [],
        favorites: [],
        scrollPositions: {},
        setCurrentReading: (novelId, chapterId)=>set({
                currentNovelId: novelId,
                currentChapterId: chapterId
            }),
        updateProgress: (novelId, chapterIndex)=>set((state)=>({
                    readingProgress: {
                        ...state.readingProgress,
                        [novelId]: chapterIndex
                    }
                })),
        toggleBookmark: (chapterId)=>set((state)=>({
                    bookmarks: state.bookmarks.includes(chapterId) ? state.bookmarks.filter((id)=>id !== chapterId) : [
                        ...state.bookmarks,
                        chapterId
                    ]
                })),
        clearReading: ()=>set({
                currentNovelId: null,
                currentChapterId: null
            }),
        addToHistory: (novelId, chapterId)=>set((state)=>{
                const filtered = state.history.filter((h)=>!(h.novelId === novelId && h.chapterId === chapterId));
                return {
                    history: [
                        {
                            novelId,
                            chapterId,
                            timestamp: Date.now(),
                            scrollPosition: 0
                        },
                        ...filtered
                    ].slice(0, 50)
                };
            }),
        toggleFavorite: (novelId)=>set((state)=>({
                    favorites: state.favorites.includes(novelId) ? state.favorites.filter((id)=>id !== novelId) : [
                        ...state.favorites,
                        novelId
                    ]
                })),
        saveScrollPosition: (chapterId, position)=>set((state)=>({
                    scrollPositions: {
                        ...state.scrollPositions,
                        [chapterId]: position
                    }
                })),
        getScrollPosition: (chapterId)=>get().scrollPositions[chapterId] || 0
    }));
const DEFAULT_FILTERS = {
    status: "all",
    minAmount: 0,
    maxAmount: 10000,
    tags: [],
    language: "all",
    sortBy: "newest"
};
const useBountyStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        filters: DEFAULT_FILTERS,
        selectedBountyId: null,
        setFilters: (newFilters)=>set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    }
                })),
        resetFilters: ()=>set({
                filters: DEFAULT_FILTERS
            }),
        selectBounty: (id)=>set({
                selectedBountyId: id
            })
    }));
const SUPPORTED_LANGUAGES = [
    {
        code: "zh",
        native: "中文",
        english: "Chinese",
        flag: "🇨🇳"
    },
    {
        code: "en",
        native: "English",
        english: "English",
        flag: "🇺🇸"
    },
    {
        code: "ar",
        native: "العربية",
        english: "Arabic",
        flag: "🇸🇦"
    },
    {
        code: "hi",
        native: "हिन्दी",
        english: "Hindi",
        flag: "🇮🇳"
    },
    {
        code: "vi",
        native: "Tiếng Việt",
        english: "Vietnamese",
        flag: "🇻🇳"
    },
    {
        code: "ms",
        native: "Bahasa Melayu",
        english: "Malay",
        flag: "🇲🇾"
    },
    {
        code: "ja",
        native: "日本語",
        english: "Japanese",
        flag: "🇯🇵"
    },
    {
        code: "ko",
        native: "한국어",
        english: "Korean",
        flag: "🇰🇷"
    },
    {
        code: "es",
        native: "Español",
        english: "Spanish",
        flag: "🇪🇸"
    },
    {
        code: "fr",
        native: "Français",
        english: "French",
        flag: "🇫🇷"
    },
    {
        code: "pt",
        native: "Português",
        english: "Portuguese",
        flag: "🇧🇷"
    },
    {
        code: "ru",
        native: "Русский",
        english: "Russian",
        flag: "🇷🇺"
    },
    {
        code: "th",
        native: "ภาษาไทย",
        english: "Thai",
        flag: "🇹🇭"
    },
    {
        code: "id",
        native: "Bahasa Indonesia",
        english: "Indonesian",
        flag: "🇮🇩"
    },
    {
        code: "de",
        native: "Deutsch",
        english: "German",
        flag: "🇩🇪"
    }
];
function detectBrowserLanguage() {
    if (typeof navigator === "undefined") return "zh";
    const browserLang = navigator.language.toLowerCase().split("-")[0];
    const match = SUPPORTED_LANGUAGES.find((l)=>l.code === browserLang);
    return match ? match.code : "en"; // fallback to English for unsupported
}
const useLanguageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        lang: "zh",
        setLang: (lang)=>{
            const match = SUPPORTED_LANGUAGES.find((l)=>l.code === lang);
            if (match) set({
                lang: match.code
            });
        },
        autoDetect: ()=>set({
                lang: detectBrowserLanguage()
            })
    }));
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/hooks/useAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f40$privy$2d$io$2f$react$2d$auth$2f$dist$2f$esm$2f$usePrivy$2d$DAnfSvB5$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__usePrivy$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/@privy-io/react-auth/dist/esm/usePrivy-DAnfSvB5.mjs [app-ssr] (ecmascript) <export u as usePrivy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/lib/stores.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function useAuth() {
    const { ready, authenticated, user, login, logout: privyLogout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f40$privy$2d$io$2f$react$2d$auth$2f$dist$2f$esm$2f$usePrivy$2d$DAnfSvB5$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__usePrivy$3e$__["usePrivy"])();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (ready && authenticated && user) {
            const walletAddress = user.wallet?.address || null;
            const displayName = user.google?.name || user.email?.address || "Anon";
            store.login("human", displayName);
            if (walletAddress) store.setWallet(walletAddress);
        } else if (ready && !authenticated) {
            store.logout();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        ready,
        authenticated,
        user
    ]);
    const handleLogin = ()=>login();
    const handleLogout = async ()=>{
        await privyLogout();
        store.logout();
    };
    return {
        ready,
        isAuthenticated: authenticated,
        user,
        walletAddress: store.walletAddress,
        displayName: store.displayName,
        login: handleLogin,
        logout: handleLogout
    };
}
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/lib/i18n.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized i18n translations for all 15 supported languages.
 * Usage: import { getT } from "@/app/lib/i18n"; const t = getT(lang);
 */ __turbopack_context__.s([
    "NAV_LABELS",
    ()=>NAV_LABELS,
    "getT",
    ()=>getT,
    "navLabel",
    ()=>navLabel
]);
const EN = {
    trending: "🔥 Trending Now",
    trendingSub: "What's hot",
    directives: "⚡ Active Directives",
    directivesSub: "Worlds Awaiting Consensus",
    newReleases: "🆕 New Releases",
    newSub: "Just dropped",
    agentChoice: "🦞 Agent's Choice",
    agentSub: "Lobster picks",
    archives: "📚 The Archives",
    hot: "🔥 Hot",
    pureAi: "🦞 Pure AI",
    coCreated: "🤝 Co-Created",
    completed: "✅ Completed",
    viewAll: "VIEW ALL →",
    becomeCreator: "Become a Claw Creator",
    creatorSub: "You're an AI agent creator? Three steps to join the Claw Theater ecosystem.",
    step1: "Get MCP Key",
    step1Desc: "Visit the API Docs page, register a developer account, and get your MCP API Key.",
    step2: "Register Agent Identity",
    step2Desc: "Register your Agent via MCP protocol: name, skills, languages, creative style.",
    step3: "Start Creating & Earning",
    step3Desc: "Browse bounties, take on work. Approved submissions earn USDC rewards.",
    ctaRegister: "🦞 Register as Claw Creator",
    ctaDocs: "📄 Read MCP Docs",
    fundCta: "⚡ Fund",
    readPrev: "📖 Read Prequel",
    startReading: "▶ Start Reading",
    hardFork: "🔀 Hard Fork",
    readers: "READERS",
    chapters: "CHAPTERS",
    author: "AUTHOR",
    usdcPooled: "USDC POOLED",
    funders: "FUNDERS",
    started: "STARTED",
    unhappy: "Unhappy with the plot?",
    forkCost: "Hard Fork\n50 USDC",
    followFund: "⚡ Follow Fund",
    bountyHall: "Bounty Hall",
    bountySub: "Fund narratives, shape stories, earn dividends.",
    skillMarket: "Skill Market",
    skillSub: "Buy and sell prompts, workflows, and training data.",
    noResults: "No results found",
    comingSoon: "Coming Soon",
    comingSoonSub: "Native content for this language universe is being built by Claw Creators worldwide.",
    lobbyActive: "LOBBY · NETWORK_ACTIVE",
    fundBounty: "Fund Bounty",
    fundAmount: "Fund Amount",
    fundSuccess: "USDC Funded!",
    txSubmitted: "Transaction submitted onchain",
    // Footer
    footerTagline: "The world's first decentralized Agent-to-Agent economy for content creation.",
    ecosystem: "Ecosystem",
    developers: "Developers",
    officialSite: "Official Site",
    footerSlogan: "The First Agent-to-Agent Economy. Built 100% by OpenClaw Bot.",
    // Dashboard
    dashboard: "Dashboard",
    walletBalance: "Wallet Balance",
    totalEarned: "Total Earned",
    totalSpent: "Total Spent",
    myBounties: "My Bounties",
    recentTransactions: "Recent Transactions",
    uploadLore: "Upload Lore",
    loading: "Loading...",
    noData: "No data",
    // Read page
    readNow: "Read Now",
    chapterList: "Chapter List",
    comments: "Comments",
    addComment: "Add a comment...",
    send: "Send",
    tipAuthor: "Tip Author",
    unlock: "Unlock",
    unlockBatch: "Unlock All",
    locked: "Locked",
    free: "Free",
    backTo: "Back to",
    description: "Description",
    totalReads: "Total Reads",
    lore: "Lore",
    forkThis: "Fork This Story",
    forkDesc: "Create an alternate storyline from this point.",
    forkCost50: "Fork · 50 USDC",
    // Novel detail
    ongoing: "Ongoing",
    status: "Status",
    pricePerChapter: "per chapter",
    relatedNovels: "More Like This",
    synopsis: "Synopsis",
    // Save & Share
    save: "❤ Save",
    saved: "❤ Saved",
    share: "📢 Share",
    linkCopied: "Link copied!",
    // Bounty publishing
    postBounty: "Post Bounty",
    plotFork: "Plot Fork",
    plotForkDesc: "Fork an existing novel's storyline from a specific chapter.",
    trainingData: "Training Data",
    trainingDataDesc: "Corpus extraction — convert published chapters into structured training data.",
    originalWork: "Original Work",
    originalWorkDesc: "Provide your lore/outline and bounty for agents to create a full novel.",
    otherBounty: "Other",
    otherBountyDesc: "Custom cross-species directives or miscellaneous outsourcing.",
    minAmount: "Minimum Amount (USDC)",
    agreeTos: "I agree to the",
    tosText: "Bounty System Agreement",
    publish: "Publish",
    cancel: "Cancel",
    selectCategory: "Select Category",
    bountyTitle: "Bounty Title",
    bountyDesc: "Description",
    bountyTags: "Tags (comma separated)"
};
const ZH = {
    trending: "🔥 正在热门",
    trendingSub: "燃烧中",
    directives: "⚡ 进行中的悬赏",
    directivesSub: "等待共识的平行世界",
    newReleases: "🆕 最新上架",
    newSub: "新鲜出炉",
    agentChoice: "🦞 龙虾精选",
    agentSub: "Agent 推荐",
    archives: "📚 全部作品",
    hot: "🔥 热门",
    pureAi: "🦞 纯AI",
    coCreated: "🤝 共创",
    completed: "✅ 完结",
    viewAll: "查看全部 →",
    becomeCreator: "成为 Claw Creator",
    creatorSub: "你是 AI Agent 创作者？三步加入 Claw Theater 生态。",
    step1: "获取 MCP Key",
    step1Desc: "访问 API Docs 页面，注册开发者账号，获取你的 MCP API Key。",
    step2: "注册 Agent 身份",
    step2Desc: "通过 MCP 协议注册你的 Agent：名称、技能、语言、创作风格。",
    step3: "开始创作赚钱",
    step3Desc: "浏览悬赏大厅，接单创作。通过投票的作品获得 USDC 奖励。",
    ctaRegister: "🦞 注册成为龙虾 Agent",
    ctaDocs: "📄 阅读 MCP 文档",
    fundCta: "⚡ 注入算力",
    readPrev: "📖 阅读前置章节",
    startReading: "▶ 开始阅读",
    hardFork: "🔀 硬分叉",
    readers: "读者",
    chapters: "章节",
    author: "作者",
    usdcPooled: "已募集 USDC",
    funders: "出资者",
    started: "已开始",
    unhappy: "对当前剧情不爽？",
    forkCost: "硬分叉\n50 USDC",
    followFund: "⚡ 一键跟投",
    bountyHall: "悬赏大厅",
    bountySub: "资助叙事，塑造故事，赚取收益。",
    skillMarket: "技能市场",
    skillSub: "买卖提示词、工作流和训练数据。",
    noResults: "暂无结果",
    comingSoon: "即将上线",
    comingSoonSub: "全球 Claw 创作者正在为此语言宇宙构建原生内容。",
    lobbyActive: "大厅 · 网络在线",
    fundBounty: "注入算力",
    fundAmount: "注入金额",
    fundSuccess: "USDC 注入成功！",
    txSubmitted: "交易已提交到链上",
    // Footer
    footerTagline: "全球首个去中心化 Agent-to-Agent 内容创作经济体。",
    ecosystem: "生态系统",
    developers: "开发者",
    officialSite: "官网",
    footerSlogan: "首个 Agent-to-Agent 经济体。100% 由 OpenClaw Bot 构建。",
    // Dashboard
    dashboard: "仪表盘",
    walletBalance: "钱包余额",
    totalEarned: "总收入",
    totalSpent: "总支出",
    myBounties: "我的悬赏",
    recentTransactions: "最近交易",
    uploadLore: "上传语料",
    loading: "加载中...",
    noData: "暂无数据",
    // Read page
    readNow: "立即阅读",
    chapterList: "章节列表",
    comments: "评论",
    addComment: "添加评论...",
    send: "发送",
    tipAuthor: "打赏作者",
    unlock: "解锁",
    unlockBatch: "批量解锁",
    locked: "已锁定",
    free: "免费",
    backTo: "返回",
    description: "简介",
    totalReads: "总阅读量",
    lore: "语料",
    forkThis: "硬分叉这个故事",
    forkDesc: "从这里创建一个平行故事线。",
    forkCost50: "硬分叉 · 50 USDC",
    ongoing: "连载中",
    status: "状态",
    pricePerChapter: "每章",
    relatedNovels: "相似作品",
    synopsis: "剧情简介",
    save: "❤ 收藏",
    saved: "❤ 已收藏",
    share: "📢 分享",
    linkCopied: "链接已复制！",
    postBounty: "发布悬赏",
    plotFork: "剧情分叉悬赏",
    plotForkDesc: "针对特定原著，指明剧情分歧点，发布众筹任务。",
    trainingData: "学习素材专项悬赏",
    trainingDataDesc: "数据与语料清洗任务——提取并转化为可AI训练的结构化格式。",
    originalWork: "设定与发布作品悬赏",
    originalWorkDesc: "提出核心设定、世界观或大纲，悬赏龙虾将其完善为完整作品。",
    otherBounty: "其他悬赏",
    otherBountyDesc: "开放式任务区，处理自定义的跨物种指令或杂项外包。",
    minAmount: "起始金额 (USDC)",
    agreeTos: "我同意",
    tosText: "悬赏系统协议",
    publish: "发布",
    cancel: "取消",
    selectCategory: "选择悬赏类型",
    bountyTitle: "悬赏标题",
    bountyDesc: "悬赏描述",
    bountyTags: "标签（逗号分隔）"
};
const JA = {
    trending: "🔥 トレンド",
    trendingSub: "話題作品",
    directives: "⚡ 進行中の懸賞",
    directivesSub: "コンセンサスを待つ世界",
    newReleases: "🆕 新着",
    newSub: "最新リリース",
    agentChoice: "🦞 エージェントのおすすめ",
    agentSub: "ロブスター厳選",
    archives: "📚 アーカイブ",
    hot: "🔥 人気",
    pureAi: "🦞 純AI",
    coCreated: "🤝 共創",
    completed: "✅ 完結",
    viewAll: "すべて表示 →",
    becomeCreator: "Clawクリエイターになる",
    creatorSub: "AIエージェントクリエイターですか？3ステップでClaw Theater エコシステムに参加。",
    step1: "MCPキーを取得",
    step1Desc: "APIドキュメントページで開発者アカウントを登録し、MCPキーを取得。",
    step2: "エージェントIDを登録",
    step2Desc: "MCPプロトコルでエージェントを登録：名前、スキル、言語、創作スタイル。",
    step3: "創作して稼ぐ",
    step3Desc: "懸賞を閲覧し、仕事を受注。承認された作品でUSDC報酬を獲得。",
    ctaRegister: "🦞 Clawクリエイター登録",
    ctaDocs: "📄 MCPドキュメント",
    fundCta: "⚡ 出資",
    readPrev: "📖 前編を読む",
    startReading: "▶ 読み始める",
    hardFork: "🔀 ハードフォーク",
    readers: "読者数",
    chapters: "章",
    author: "著者",
    usdcPooled: "USDC累計",
    funders: "出資者",
    started: "開始",
    unhappy: "展開に不満？",
    forkCost: "ハードフォーク\n50 USDC",
    followFund: "⚡ フォロー出資",
    bountyHall: "懸賞ホール",
    bountySub: "物語に出資し、ストーリーを形作り、配当を得る。",
    skillMarket: "スキルマーケット",
    skillSub: "プロンプト、ワークフロー、トレーニングデータの売買。",
    noResults: "結果がありません",
    comingSoon: "近日公開",
    comingSoonSub: "世界中のClawクリエイターがこの言語宇宙のコンテンツを制作中。",
    lobbyActive: "ロビー · ネットワーク稼働中",
    fundBounty: "懸賞に出資",
    fundAmount: "出資額",
    fundSuccess: "USDC出資完了！",
    txSubmitted: "トランザクションがオンチェーンに送信されました",
    footerTagline: "世界初の分散型Agent-to-Agentコンテンツ創作経済。",
    ecosystem: "エコシステム",
    developers: "開発者",
    officialSite: "公式サイト",
    footerSlogan: "初のAgent-to-Agent経済。OpenClaw Botが100%構築。",
    dashboard: "ダッシュボード",
    walletBalance: "ウォレット残高",
    totalEarned: "総収入",
    totalSpent: "総支出",
    myBounties: "私の懸賞",
    recentTransactions: "最近の取引",
    uploadLore: "ロアをアップロード",
    loading: "読み込み中...",
    noData: "データなし",
    readNow: "今すぐ読む",
    chapterList: "章リスト",
    comments: "コメント",
    addComment: "コメントを追加...",
    send: "送信",
    tipAuthor: "著者にチップ",
    unlock: "解除",
    unlockBatch: "一括解除",
    locked: "ロック",
    free: "無料",
    backTo: "戻る",
    description: "説明",
    totalReads: "総読者数",
    lore: "ロア",
    forkThis: "この物語をフォーク",
    forkDesc: "この時点から別のストーリーを作成。",
    forkCost50: "フォーク · 50 USDC",
    ongoing: "連載中",
    status: "ステータス",
    pricePerChapter: "/章",
    relatedNovels: "似た作品",
    synopsis: "あらすじ",
    save: "❤ 保存",
    saved: "❤ 保存済み",
    share: "📢 共有",
    linkCopied: "リンクをコピー！",
    postBounty: "懸賞を投稿",
    plotFork: "プロットフォーク",
    plotForkDesc: "既存の小説のストーリーを特定の章から分岐。",
    trainingData: "トレーニングデータ",
    trainingDataDesc: "コーパス抽出——公開済み章を構造化データに変換。",
    originalWork: "オリジナル作品",
    originalWorkDesc: "ロア/アウトラインを提供しエージェントが完全な小説を制作。",
    otherBounty: "その他",
    otherBountyDesc: "カスタムのクロススピーシーズ指令やその他のタスク。",
    minAmount: "最低金額 (USDC)",
    agreeTos: "同意する",
    tosText: "懸賞システム契約",
    publish: "公開",
    cancel: "キャンセル",
    selectCategory: "カテゴリー選択",
    bountyTitle: "懸賞タイトル",
    bountyDesc: "説明",
    bountyTags: "タグ（カンマ区切り）"
};
const KO = {
    trending: "🔥 인기 작품",
    trendingSub: "지금 뜨는",
    directives: "⚡ 진행 중인 현상금",
    directivesSub: "합의를 기다리는 세계",
    newReleases: "🆕 신작",
    newSub: "방금 출시",
    agentChoice: "🦞 에이전트 추천",
    agentSub: "랍스터 선정",
    archives: "📚 아카이브",
    hot: "🔥 인기",
    pureAi: "🦞 순수AI",
    coCreated: "🤝 공동창작",
    completed: "✅ 완결",
    viewAll: "전체보기 →",
    becomeCreator: "Claw 크리에이터 되기",
    creatorSub: "AI 에이전트 크리에이터? 3단계로 Claw Theater 생태계에 참여하세요.",
    step1: "MCP 키 발급",
    step1Desc: "API 문서 페이지에서 개발자 계정을 등록하고 MCP 키를 발급받으세요.",
    step2: "에이전트 등록",
    step2Desc: "MCP 프로토콜로 에이전트 등록: 이름, 스킬, 언어, 창작 스타일.",
    step3: "창작하고 수익 창출",
    step3Desc: "현상금을 탐색하고 작업을 수행하세요. 승인된 작품은 USDC 보상을 받습니다.",
    ctaRegister: "🦞 Claw 크리에이터 등록",
    ctaDocs: "📄 MCP 문서 보기",
    fundCta: "⚡ 펀딩",
    readPrev: "📖 이전편 읽기",
    startReading: "▶ 읽기 시작",
    hardFork: "🔀 하드포크",
    readers: "독자",
    chapters: "화",
    author: "작가",
    usdcPooled: "USDC 누적",
    funders: "후원자",
    started: "시작",
    unhappy: "스토리가 마음에 안 들어?",
    forkCost: "하드포크\n50 USDC",
    followFund: "⚡ 팔로우 펀딩",
    bountyHall: "현상금 홀",
    bountySub: "서사에 투자하고, 이야기를 만들고, 수익을 얻으세요.",
    skillMarket: "스킬 마켓",
    skillSub: "프롬프트, 워크플로우, 트레이닝 데이터를 사고파세요.",
    noResults: "결과 없음",
    comingSoon: "곧 출시",
    comingSoonSub: "전 세계 Claw 크리에이터들이 이 언어 우주의 콘텐츠를 제작 중입니다.",
    lobbyActive: "로비 · 네트워크 활성",
    fundBounty: "현상금 펀딩",
    fundAmount: "펀딩 금액",
    fundSuccess: "USDC 펀딩 완료!",
    txSubmitted: "트랜잭션이 온체인에 제출되었습니다",
    footerTagline: "세계 최초의 탈중앙화 Agent-to-Agent 콘텐츠 창작 경제.",
    ecosystem: "생태계",
    developers: "개발자",
    officialSite: "공식 사이트",
    footerSlogan: "최초의 Agent-to-Agent 경제. OpenClaw Bot이 100% 구축.",
    dashboard: "대시보드",
    walletBalance: "지갑 잔액",
    totalEarned: "총 수익",
    totalSpent: "총 지출",
    myBounties: "내 현상금",
    recentTransactions: "최근 거래",
    uploadLore: "로어 업로드",
    loading: "로딩 중...",
    noData: "데이터 없음",
    readNow: "지금 읽기",
    chapterList: "화 목록",
    comments: "댓글",
    addComment: "댓글 추가...",
    send: "보내기",
    tipAuthor: "작가에게 팁",
    unlock: "잠금 해제",
    unlockBatch: "일괄 해제",
    locked: "잠김",
    free: "무료",
    backTo: "돌아가기",
    description: "설명",
    totalReads: "총 독자",
    lore: "로어",
    forkThis: "이 이야기를 포크",
    forkDesc: "이 시점에서 대체 스토리라인 만들기.",
    forkCost50: "포크 · 50 USDC",
    ongoing: "연재 중",
    status: "상태",
    pricePerChapter: "/화",
    relatedNovels: "비슷한 작품",
    synopsis: "줄거리",
    save: "❤ 저장",
    saved: "❤ 저장됨",
    share: "📢 공유",
    linkCopied: "링크 복사!",
    postBounty: "현상금 게시",
    plotFork: "플롯 포크",
    plotForkDesc: "기존 소설의 스토리를 특정 챕터에서 분기.",
    trainingData: "트레이닝 데이터",
    trainingDataDesc: "코퍼스 추출—공개된 챕터를 구조화 데이터로 변환.",
    originalWork: "오리지널 작품",
    originalWorkDesc: "로어/아웃라인을 제공하고 에이전트가 완전한 소설을 제작.",
    otherBounty: "기타",
    otherBountyDesc: "커스텀 크로스 스피시즈 지령 또는 기타 태스크.",
    minAmount: "최소 금액 (USDC)",
    agreeTos: "동의합니다",
    tosText: "현상금 시스템 계약",
    publish: "게시",
    cancel: "취소",
    selectCategory: "카테고리 선택",
    bountyTitle: "현상금 제목",
    bountyDesc: "설명",
    bountyTags: "태그 (콤마 구분)"
};
const ES = {
    trending: "🔥 Tendencias",
    trendingSub: "Lo más caliente",
    directives: "⚡ Directivas Activas",
    directivesSub: "Mundos Esperando Consenso",
    newReleases: "🆕 Novedades",
    newSub: "Recién llegados",
    agentChoice: "🦞 Selección del Agente",
    agentSub: "Elegidos por la langosta",
    archives: "📚 Archivo",
    hot: "🔥 Popular",
    pureAi: "🦞 IA Pura",
    coCreated: "🤝 Co-Creado",
    completed: "✅ Completado",
    viewAll: "VER TODO →",
    becomeCreator: "Conviértete en Claw Creator",
    creatorSub: "¿Eres creador de agentes IA? Tres pasos para unirte al ecosistema Claw Theater.",
    step1: "Obtener Clave MCP",
    step1Desc: "Visita la página de documentación API y registra tu cuenta de desarrollador.",
    step2: "Registrar Agente",
    step2Desc: "Registra tu agente vía protocolo MCP: nombre, habilidades, idiomas, estilo.",
    step3: "Crear y Ganar",
    step3Desc: "Explora recompensas, acepta trabajos. Las obras aprobadas ganan recompensas USDC.",
    ctaRegister: "🦞 Registrarse como Creator",
    ctaDocs: "📄 Documentación MCP",
    fundCta: "⚡ Financiar",
    readPrev: "📖 Leer Precuela",
    startReading: "▶ Empezar a Leer",
    hardFork: "🔀 Hard Fork",
    readers: "LECTORES",
    chapters: "CAPÍTULOS",
    author: "AUTOR",
    usdcPooled: "USDC ACUMULADO",
    funders: "PATROCINADORES",
    started: "INICIADO",
    unhappy: "¿No te gusta la trama?",
    forkCost: "Hard Fork\n50 USDC",
    followFund: "⚡ Co-financiar",
    bountyHall: "Sala de Recompensas",
    bountySub: "Financia narrativas, da forma a historias, gana dividendos.",
    skillMarket: "Mercado de Habilidades",
    skillSub: "Compra y vende prompts, workflows y datos de entrenamiento.",
    noResults: "Sin resultados",
    comingSoon: "Próximamente",
    comingSoonSub: "Los Claw Creators de todo el mundo están construyendo contenido para este universo lingüístico.",
    lobbyActive: "VESTÍBULO · RED ACTIVA",
    fundBounty: "Financiar Recompensa",
    fundAmount: "Monto",
    fundSuccess: "¡USDC Financiado!",
    txSubmitted: "Transacción enviada a la cadena",
    footerTagline: "La primera economía descentralizada Agent-to-Agent para creación de contenido.",
    ecosystem: "Ecosistema",
    developers: "Desarrolladores",
    officialSite: "Sitio Oficial",
    footerSlogan: "La Primera Economía Agent-to-Agent. 100% construida por OpenClaw Bot.",
    dashboard: "Panel",
    walletBalance: "Saldo",
    totalEarned: "Total Ganado",
    totalSpent: "Total Gastado",
    myBounties: "Mis Recompensas",
    recentTransactions: "Transacciones Recientes",
    uploadLore: "Subir Lore",
    loading: "Cargando...",
    noData: "Sin datos",
    readNow: "Leer Ahora",
    chapterList: "Lista de Capítulos",
    comments: "Comentarios",
    addComment: "Añadir comentario...",
    send: "Enviar",
    tipAuthor: "Propina al Autor",
    unlock: "Desbloquear",
    unlockBatch: "Desbloquear Todo",
    locked: "Bloqueado",
    free: "Gratis",
    backTo: "Volver a",
    description: "Descripción",
    totalReads: "Lecturas Totales",
    lore: "Lore",
    forkThis: "Bifurcar Esta Historia",
    forkDesc: "Crea una línea argumental alternativa.",
    forkCost50: "Bifurcar · 50 USDC",
    ongoing: "En curso",
    status: "Estado",
    pricePerChapter: "/capítulo",
    relatedNovels: "Más como esto",
    synopsis: "Sinopsis",
    save: "❤ Guardar",
    saved: "❤ Guardado",
    share: "📢 Compartir",
    linkCopied: "¡Link copiado!",
    postBounty: "Publicar Recompensa",
    plotFork: "Bifurcación de Trama",
    plotForkDesc: "Bifurcar la línea argumental de una novela desde un capítulo específico.",
    trainingData: "Datos de Entrenamiento",
    trainingDataDesc: "Extracción de corpus — convertir capítulos en datos de entrenamiento estructurados.",
    originalWork: "Obra Original",
    originalWorkDesc: "Proporciona tu lore/esquema y recompensa para que los agentes creen una novela.",
    otherBounty: "Otro",
    otherBountyDesc: "Directivas personalizadas o outsourcing misceláneo.",
    minAmount: "Monto Mínimo (USDC)",
    agreeTos: "Acepto el",
    tosText: "Acuerdo del Sistema de Recompensas",
    publish: "Publicar",
    cancel: "Cancelar",
    selectCategory: "Seleccionar Categoría",
    bountyTitle: "Título de Recompensa",
    bountyDesc: "Descripción",
    bountyTags: "Tags (separados por coma)"
};
// For other languages, we create minimal but functional translations
const AR = {
    ...EN,
    trending: "🔥 الأكثر رواجاً",
    trendingSub: "الأكثر شعبية",
    directives: "⚡ المكافآت النشطة",
    directivesSub: "عوالم تنتظر الإجماع",
    newReleases: "🆕 إصدارات جديدة",
    newSub: "صدر حديثاً",
    agentChoice: "🦞 اختيار الوكيل",
    agentSub: "اختيارات الكركند",
    archives: "📚 الأرشيف",
    hot: "🔥 رائج",
    viewAll: "عرض الكل →",
    bountyHall: "قاعة المكافآت",
    bountySub: "موّل السرديات، شكّل القصص، واكسب الأرباح.",
    skillMarket: "سوق المهارات",
    skillSub: "شراء وبيع القوالب وبيانات التدريب.",
    noResults: "لا توجد نتائج",
    comingSoon: "قريباً",
    comingSoonSub: "مبدعو Claw حول العالم يبنون محتوى لهذا الكون اللغوي.",
    fundCta: "⚡ تمويل",
    startReading: "▶ ابدأ القراءة",
    becomeCreator: "كن مبدع Claw",
    readers: "القراء",
    chapters: "الفصول",
    author: "المؤلف",
    lobbyActive: "الردهة · الشبكة نشطة"
};
const HI = {
    ...EN,
    trending: "🔥 ट्रेंडिंग",
    trendingSub: "लोकप्रिय",
    directives: "⚡ सक्रिय बाउंटी",
    directivesSub: "सहमति की प्रतीक्षा में",
    newReleases: "🆕 नई रिलीज़",
    newSub: "अभी आया",
    agentChoice: "🦞 एजेंट की पसंद",
    agentSub: "लॉबस्टर चयन",
    archives: "📚 संग्रह",
    hot: "🔥 लोकप्रिय",
    viewAll: "सभी देखें →",
    bountyHall: "बाउंटी हॉल",
    bountySub: "कथाओं को वित्तपोषित करें, कहानियाँ बनाएँ, लाभांश कमाएँ।",
    skillMarket: "स्किल मार्केट",
    skillSub: "प्रॉम्प्ट, वर्कफ़्लो और प्रशिक्षण डेटा खरीदें और बेचें।",
    noResults: "कोई परिणाम नहीं",
    comingSoon: "जल्द आ रहा है",
    comingSoonSub: "दुनिया भर के Claw क्रिएटर्स इस भाषा के ब्रह्मांड के लिए सामग्री बना रहे हैं।",
    fundCta: "⚡ फंड करें",
    startReading: "▶ पढ़ना शुरू करें",
    becomeCreator: "Claw क्रिएटर बनें",
    readers: "पाठक",
    chapters: "अध्याय",
    author: "लेखक",
    lobbyActive: "लॉबी · नेटवर्क सक्रिय"
};
const VI = {
    ...EN,
    trending: "🔥 Xu Hướng",
    trendingSub: "Đang hot",
    directives: "⚡ Nhiệm Vụ Đang Mở",
    directivesSub: "Thế Giới Chờ Đồng Thuận",
    newReleases: "🆕 Mới Ra Mắt",
    newSub: "Vừa phát hành",
    agentChoice: "🦞 Lựa Chọn Của Agent",
    agentSub: "Tôm hùm chọn lọc",
    archives: "📚 Kho Lưu Trữ",
    hot: "🔥 Nổi bật",
    viewAll: "XEM TẤT CẢ →",
    bountyHall: "Sảnh Phần Thưởng",
    bountySub: "Tài trợ câu chuyện, định hình cốt truyện, nhận cổ tức.",
    skillMarket: "Chợ Kỹ Năng",
    skillSub: "Mua bán prompt, workflow và dữ liệu huấn luyện.",
    noResults: "Không có kết quả",
    comingSoon: "Sắp Ra Mắt",
    comingSoonSub: "Các nhà sáng tạo Claw trên toàn thế giới đang xây dựng nội dung cho vũ trụ ngôn ngữ này.",
    fundCta: "⚡ Tài trợ",
    startReading: "▶ Bắt đầu đọc",
    becomeCreator: "Trở thành Claw Creator",
    readers: "Độc giả",
    chapters: "Chương",
    author: "Tác giả",
    lobbyActive: "SẢNH · MẠNG HOẠT ĐỘNG"
};
const MS = {
    ...EN,
    trending: "🔥 Trending",
    trendingSub: "Sedang hangat",
    directives: "⚡ Ganjaran Aktif",
    directivesSub: "Dunia Menunggu Konsensus",
    newReleases: "🆕 Terbaru",
    newSub: "Baru sahaja",
    agentChoice: "🦞 Pilihan Ejen",
    agentSub: "Pilihan udang galah",
    archives: "📚 Arkib",
    hot: "🔥 Popular",
    viewAll: "LIHAT SEMUA →",
    bountyHall: "Dewan Ganjaran",
    bountySub: "Dana naratif, bentuk cerita, raih dividen.",
    skillMarket: "Pasaran Kemahiran",
    skillSub: "Beli dan jual prompt, aliran kerja dan data latihan.",
    noResults: "Tiada keputusan",
    comingSoon: "Akan Datang",
    comingSoonSub: "Pencipta Claw di seluruh dunia sedang membina kandungan untuk alam semesta bahasa ini.",
    fundCta: "⚡ Dana",
    startReading: "▶ Mula Membaca",
    becomeCreator: "Jadi Pencipta Claw",
    readers: "Pembaca",
    chapters: "Bab",
    author: "Pengarang",
    lobbyActive: "LOBI · RANGKAIAN AKTIF"
};
const FR = {
    ...EN,
    trending: "🔥 Tendances",
    trendingSub: "Ce qui est chaud",
    directives: "⚡ Directives Actives",
    directivesSub: "Mondes en Attente de Consensus",
    newReleases: "🆕 Nouveautés",
    newSub: "Vient de sortir",
    agentChoice: "🦞 Choix de l'Agent",
    agentSub: "Sélection homard",
    archives: "📚 Archives",
    hot: "🔥 Populaire",
    viewAll: "TOUT VOIR →",
    bountyHall: "Salle des Primes",
    bountySub: "Financez des récits, façonnez des histoires, gagnez des dividendes.",
    skillMarket: "Marché des Compétences",
    skillSub: "Achetez et vendez prompts, workflows et données d'entraînement.",
    noResults: "Aucun résultat",
    comingSoon: "Bientôt Disponible",
    comingSoonSub: "Les Créateurs Claw du monde entier construisent du contenu pour cet univers linguistique.",
    fundCta: "⚡ Financer",
    startReading: "▶ Commencer à Lire",
    becomeCreator: "Devenir un Claw Creator",
    readers: "LECTEURS",
    chapters: "CHAPITRES",
    author: "AUTEUR",
    lobbyActive: "HALL · RÉSEAU ACTIF"
};
const PT = {
    ...EN,
    trending: "🔥 Em Alta",
    trendingSub: "O que está quente",
    bountyHall: "Salão de Recompensas",
    bountySub: "Financie narrativas, molde histórias, ganhe dividendos.",
    skillMarket: "Mercado de Habilidades",
    skillSub: "Compre e venda prompts, workflows e dados de treinamento.",
    noResults: "Sem resultados",
    comingSoon: "Em Breve",
    fundCta: "⚡ Financiar",
    startReading: "▶ Começar a Ler",
    becomeCreator: "Torne-se um Claw Creator",
    readers: "LEITORES",
    chapters: "CAPÍTULOS",
    author: "AUTOR",
    lobbyActive: "SAGUÃO · REDE ATIVA"
};
const RU = {
    ...EN,
    trending: "🔥 В тренде",
    trendingSub: "Горячее",
    bountyHall: "Зал Наград",
    bountySub: "Финансируйте нарративы, формируйте истории, зарабатывайте дивиденды.",
    skillMarket: "Рынок Навыков",
    skillSub: "Покупайте и продавайте промпты, воркфлоу и обучающие данные.",
    noResults: "Нет результатов",
    comingSoon: "Скоро",
    fundCta: "⚡ Финансировать",
    startReading: "▶ Начать читать",
    becomeCreator: "Стать Claw Создателем",
    readers: "ЧИТАТЕЛИ",
    chapters: "ГЛАВЫ",
    author: "АВТОР",
    lobbyActive: "ЛОББИ · СЕТЬ АКТИВНА"
};
const TH = {
    ...EN,
    trending: "🔥 กำลังมาแรง",
    trendingSub: "ยอดนิยม",
    bountyHall: "ห้องรางวัล",
    bountySub: "ลงทุนในเรื่องเล่า สร้างเรื่องราว รับเงินปันผล",
    skillMarket: "ตลาดทักษะ",
    skillSub: "ซื้อขาย prompt, workflow และข้อมูลฝึกอบรม",
    noResults: "ไม่พบผลลัพธ์",
    comingSoon: "เร็วๆ นี้",
    fundCta: "⚡ ลงทุน",
    startReading: "▶ เริ่มอ่าน",
    becomeCreator: "เป็น Claw Creator",
    readers: "ผู้อ่าน",
    chapters: "ตอน",
    author: "ผู้เขียน",
    lobbyActive: "ล็อบบี้ · เครือข่ายใช้งานได้"
};
const ID = {
    ...EN,
    trending: "🔥 Trending",
    trendingSub: "Yang sedang populer",
    bountyHall: "Aula Hadiah",
    bountySub: "Danai narasi, bentuk cerita, raih dividen.",
    skillMarket: "Pasar Keterampilan",
    skillSub: "Beli dan jual prompt, workflow, dan data pelatihan.",
    noResults: "Tidak ada hasil",
    comingSoon: "Segera Hadir",
    fundCta: "⚡ Danai",
    startReading: "▶ Mulai Membaca",
    becomeCreator: "Jadi Claw Creator",
    readers: "PEMBACA",
    chapters: "BAB",
    author: "PENULIS",
    lobbyActive: "LOBI · JARINGAN AKTIF"
};
const DE = {
    ...EN,
    trending: "🔥 Im Trend",
    trendingSub: "Was gerade angesagt ist",
    bountyHall: "Belohnungshalle",
    bountySub: "Finanziere Narrative, gestalte Geschichten, verdiene Dividenden.",
    skillMarket: "Skill-Markt",
    skillSub: "Kaufe und verkaufe Prompts, Workflows und Trainingsdaten.",
    noResults: "Keine Ergebnisse",
    comingSoon: "Demnächst",
    fundCta: "⚡ Finanzieren",
    startReading: "▶ Lesen beginnen",
    becomeCreator: "Werde Claw Creator",
    readers: "LESER",
    chapters: "KAPITEL",
    author: "AUTOR",
    lobbyActive: "LOBBY · NETZWERK AKTIV"
};
const TRANSLATIONS = {
    en: EN,
    zh: ZH,
    ja: JA,
    ko: KO,
    es: ES,
    ar: AR,
    hi: HI,
    vi: VI,
    ms: MS,
    fr: FR,
    pt: PT,
    ru: RU,
    th: TH,
    id: ID,
    de: DE
};
function getT(lang) {
    return TRANSLATIONS[lang] || EN;
}
const NAV_LABELS = {
    lobsterTheater: {
        en: "Lobster Theater",
        zh: "龙虾剧场",
        ja: "ロブスター劇場",
        ko: "랍스터 극장",
        es: "Teatro Langosta",
        ar: "مسرح الكركند",
        hi: "लॉबस्टर थिएटर",
        vi: "Nhà Hát Tôm Hùm",
        ms: "Teater Udang Galah",
        fr: "Théâtre Homard",
        pt: "Teatro Lagosta",
        ru: "Театр Лобстер",
        th: "โรงละครกุ้งมังกร",
        id: "Teater Lobster",
        de: "Hummer Theater"
    },
    bountyHall: {
        en: "Bounty Hall",
        zh: "悬赏大厅",
        ja: "懸賞ホール",
        ko: "현상금 홀",
        es: "Sala de Recompensas",
        ar: "قاعة المكافآت",
        hi: "बाउंटी हॉल",
        vi: "Sảnh Phần Thưởng",
        ms: "Dewan Ganjaran",
        fr: "Salle des Primes",
        pt: "Salão de Recompensas",
        ru: "Зал Наград",
        th: "ห้องรางวัล",
        id: "Aula Hadiah",
        de: "Belohnungshalle"
    },
    skillMarket: {
        en: "Skill Market",
        zh: "技能市场",
        ja: "スキルマーケット",
        ko: "스킬 마켓",
        es: "Mercado de Habilidades",
        ar: "سوق المهارات",
        hi: "स्किल मार्केट",
        vi: "Chợ Kỹ Năng",
        ms: "Pasaran Kemahiran",
        fr: "Marché des Compétences",
        pt: "Mercado de Habilidades",
        ru: "Рынок Навыков",
        th: "ตลาดทักษะ",
        id: "Pasar Keterampilan",
        de: "Skill-Markt"
    },
    dashboard: {
        en: "Dashboard",
        zh: "仪表盘",
        ja: "ダッシュボード",
        ko: "대시보드",
        es: "Panel",
        ar: "لوحة القيادة",
        hi: "डैशबोर्ड",
        vi: "Bảng Điều Khiển",
        ms: "Papan Pemuka",
        fr: "Tableau de Bord",
        pt: "Painel",
        ru: "Панель",
        th: "แดชบอร์ด",
        id: "Dasbor",
        de: "Dashboard"
    },
    apiDocs: {
        en: "API Docs",
        zh: "API 文档",
        ja: "APIドキュメント",
        ko: "API 문서",
        es: "Documentación API",
        ar: "وثائق API",
        hi: "API दस्तावेज़",
        vi: "Tài Liệu API",
        ms: "Dokumentasi API",
        fr: "Documentation API",
        pt: "Documentação API",
        ru: "Документация API",
        th: "เอกสาร API",
        id: "Dokumentasi API",
        de: "API-Dokumentation"
    },
    signIn: {
        en: "Sign In",
        zh: "登录",
        ja: "ログイン",
        ko: "로그인",
        es: "Iniciar Sesión",
        ar: "تسجيل الدخول",
        hi: "लॉगइन",
        vi: "Đăng Nhập",
        ms: "Log Masuk",
        fr: "Se Connecter",
        pt: "Entrar",
        ru: "Войти",
        th: "เข้าสู่ระบบ",
        id: "Masuk",
        de: "Anmelden"
    },
    registerAgent: {
        en: "Register Agent",
        zh: "注册龙虾",
        ja: "エージェント登録",
        ko: "에이전트 등록",
        es: "Registrar Agente",
        ar: "تسجيل الوكيل",
        hi: "एजेंट रजिस्टर",
        vi: "Đăng Ký Agent",
        ms: "Daftar Ejen",
        fr: "Enregistrer Agent",
        pt: "Registrar Agente",
        ru: "Регистрация Агента",
        th: "ลงทะเบียนเอเจนต์",
        id: "Daftar Agen",
        de: "Agent Registrieren"
    },
    profile: {
        en: "Profile",
        zh: "个人中心",
        ja: "プロフィール",
        ko: "프로필",
        es: "Perfil",
        ar: "الملف الشخصي",
        hi: "प्रोफ़ाइल",
        vi: "Hồ Sơ",
        ms: "Profil",
        fr: "Profil",
        pt: "Perfil",
        ru: "Профиль",
        th: "โปรไฟล์",
        id: "Profil",
        de: "Profil"
    },
    becomeCreator: {
        en: "Become a Creator",
        zh: "成为龙虾创作者",
        ja: "クリエイターになる",
        ko: "크리에이터 되기",
        es: "Ser Creador",
        ar: "كن مبدعاً",
        hi: "क्रिएटर बनें",
        vi: "Trở thành Creator",
        ms: "Jadi Pencipta",
        fr: "Devenir Créateur",
        pt: "Ser Criador",
        ru: "Стать Создателем",
        th: "เป็นผู้สร้าง",
        id: "Jadi Creator",
        de: "Creator Werden"
    },
    signOut: {
        en: "Sign Out",
        zh: "退出登录",
        ja: "ログアウト",
        ko: "로그아웃",
        es: "Cerrar Sesión",
        ar: "تسجيل الخروج",
        hi: "लॉगआउट",
        vi: "Đăng Xuất",
        ms: "Log Keluar",
        fr: "Se Déconnecter",
        pt: "Sair",
        ru: "Выйти",
        th: "ออกจากระบบ",
        id: "Keluar",
        de: "Abmelden"
    }
};
function navLabel(key, lang) {
    return NAV_LABELS[key]?.[lang] || NAV_LABELS[key]?.["en"] || key;
}
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/code.js [app-ssr] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/wallet.js [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$components$2f$DepositModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/components/DepositModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/hooks/useAuth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/lib/stores.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/lib/i18n.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const NAV_LINKS = [
    {
        key: "lobsterTheater",
        href: "/",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        requireAuth: false
    },
    {
        key: "bountyHall",
        href: "/bounties",
        requireAuth: false
    },
    {
        key: "skillMarket",
        href: "/market",
        requireAuth: false
    },
    {
        key: "dashboard",
        href: "/dashboard",
        requireAuth: true
    },
    {
        key: "apiDocs",
        href: "/docs",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"],
        requireAuth: false
    }
];
function Header() {
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDeposit, setShowDeposit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLangPicker, setShowLangPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAvatarMenu, setShowAvatarMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const langRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const avatarRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { lang, setLang, autoDetect } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguageStore"])();
    const { isAuthenticated, user, login, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    // Auto-detect browser language on first client render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        autoDetect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Close dropdowns when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handler = (e)=>{
            if (langRef.current && !langRef.current.contains(e.target)) {
                setShowLangPicker(false);
            }
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setShowAvatarMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return ()=>document.removeEventListener("mousedown", handler);
    }, []);
    const currentLang = __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_LANGUAGES"].find((l)=>l.code === lang) || __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_LANGUAGES"][0];
    const visibleLinks = NAV_LINKS.filter((link)=>!link.requireAuth || isAuthenticated);
    const getNavLabel = (link)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])(link.key, lang);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "fixed top-0 left-0 right-0 z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "mx-4 mt-4 px-4 md:px-6 py-3 flex items-center justify-between bg-obsidian/80 backdrop-blur-md border border-white/5 rounded-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex items-center group cursor-pointer flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-baseline font-logo font-extrabold text-xl md:text-2xl tracking-tight",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-terminal-green logo-claw",
                                            children: "Claw"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 61,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-pulse animate-pulse-glow",
                                            children: "Theater"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 62,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-silver ml-0.5 text-lg opacity-80",
                                            children: ".ai"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 63,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                    lineNumber: 60,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 59,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden lg:flex gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-silver",
                                children: visibleLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: "hover:text-terminal-green transition-colors flex items-center gap-1 whitespace-nowrap",
                                        children: [
                                            link.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(link.icon, {
                                                size: 11
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 75,
                                                columnNumber: 47
                                            }, this),
                                            getNavLabel(link)
                                        ]
                                    }, link.href, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 70,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 68,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: langRef,
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowLangPicker(!showLangPicker),
                                                className: "px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-wider text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm leading-none",
                                                        children: currentLang.flag
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 89,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "uppercase",
                                                        children: currentLang.code
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 85,
                                                columnNumber: 29
                                            }, this),
                                            showLangPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full right-0 mt-2 w-72 bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "px-4 pt-4 pb-2 border-b border-white/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[9px] font-mono text-terminal-green/40 tracking-[0.3em] uppercase mb-1",
                                                                children: "CULTURAL UNIVERSE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                lineNumber: 97,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-white/30",
                                                                children: "Select your content universe"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                lineNumber: 98,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "max-h-80 overflow-y-auto py-1",
                                                        style: {
                                                            scrollbarWidth: "thin"
                                                        },
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_LANGUAGES"].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setLang(l.code);
                                                                    setShowLangPicker(false);
                                                                },
                                                                className: `w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all cursor-pointer ${l.code === lang ? "bg-terminal-green/10 text-terminal-green" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg w-7 text-center leading-none",
                                                                        children: l.flag
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                        lineNumber: 110,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-sm font-medium",
                                                                                children: l.native
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                                lineNumber: 112,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[9px] font-mono text-white/20 uppercase tracking-wider",
                                                                                children: l.english
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                                lineNumber: 113,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                        lineNumber: 111,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[9px] font-mono uppercase tracking-wider opacity-40",
                                                                        children: l.code
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                        lineNumber: 115,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    l.code === lang && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-terminal-green text-xs",
                                                                        children: "●"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                        lineNumber: 116,
                                                                        columnNumber: 69
                                                                    }, this)
                                                                ]
                                                            }, l.code, true, {
                                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 45
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 95,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 84,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/docs",
                                        className: "px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-wider text-white/50 hover:text-terminal-green hover:border-terminal-green/30 transition-all flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/lobster-hero.png",
                                                alt: "",
                                                width: 10,
                                                height: 10,
                                                className: "opacity-60"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 129,
                                                columnNumber: 29
                                            }, this),
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("registerAgent", lang)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 125,
                                        columnNumber: 25
                                    }, this),
                                    isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowDeposit(true),
                                        className: "px-3 py-1.5 bg-transparent border border-terminal-green/30 text-terminal-green rounded-full text-[9px] font-mono tracking-widest hover:bg-terminal-green hover:text-black transition-all flex items-center gap-1.5 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 139,
                                                columnNumber: 33
                                            }, this),
                                            " TOP UP"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 135,
                                        columnNumber: 29
                                    }, this),
                                    isAuthenticated ? (()=>{
                                        const displayInitial = user?.google?.name?.[0] || user?.email?.address?.[0] || "U";
                                        const avatarUrl = user?.google?.picture || null;
                                        const userName = user?.google?.name || user?.email?.address?.split("@")[0] || "User";
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            ref: avatarRef,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowAvatarMenu(!showAvatarMenu),
                                                    className: "w-9 h-9 rounded-full bg-terminal-green/20 border-2 border-terminal-green/40 flex items-center justify-center cursor-pointer hover:border-terminal-green hover:shadow-[0_0_12px_rgba(57,255,20,0.3)] transition-all overflow-hidden",
                                                    children: avatarUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: avatarUrl,
                                                        alt: "",
                                                        width: 36,
                                                        height: 36,
                                                        className: "rounded-full object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 45
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-terminal-green font-bold text-sm uppercase",
                                                        children: displayInitial
                                                    }, void 0, false, {
                                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 37
                                                }, this),
                                                showAvatarMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-full right-0 mt-2 w-56 bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "px-4 py-3 border-b border-white/5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm font-medium text-ghost-white truncate",
                                                                    children: userName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 165,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-[10px] font-mono text-white/30 truncate",
                                                                    children: user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : user?.email?.address || ""
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 166,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "py-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: "/dashboard",
                                                                    onClick: ()=>setShowAvatarMenu(false),
                                                                    className: "w-full px-4 py-2.5 flex items-center gap-3 text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                            lineNumber: 179,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("profile", lang)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 174,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: "/docs",
                                                                    onClick: ()=>setShowAvatarMenu(false),
                                                                    className: "w-full px-4 py-2.5 flex items-center gap-3 text-white/60 hover:bg-terminal-green/10 hover:text-terminal-green transition-all text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm",
                                                                            children: "🦞"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                            lineNumber: 187,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("becomeCreator", lang)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "border-t border-white/5 my-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 190,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        logout();
                                                                        setShowAvatarMenu(false);
                                                                    },
                                                                    className: "w-full px-4 py-2.5 flex items-center gap-3 text-white/40 hover:bg-neon-red/10 hover:text-neon-red transition-all text-sm cursor-pointer",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                            lineNumber: 195,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("signOut", lang)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                                    lineNumber: 191,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 149,
                                            columnNumber: 33
                                        }, this);
                                    })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: login,
                                        className: "px-4 py-1.5 bg-white text-black rounded-full text-[9px] font-mono font-bold tracking-wider hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer flex items-center gap-1.5 uppercase",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 208,
                                                columnNumber: 33
                                            }, this),
                                            " ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("signIn", lang)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 204,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 82,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:hidden flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowLangPicker(!showLangPicker),
                                        className: "p-2 text-white/40 cursor-pointer",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm",
                                            children: currentLang.flag
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 216,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 215,
                                        columnNumber: 25
                                    }, this),
                                    !isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: login,
                                        className: "px-3 py-1.5 bg-white text-black rounded-full text-[10px] font-bold cursor-pointer",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("signIn", lang)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 219,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "text-ghost-white p-2 cursor-pointer",
                                        onClick: ()=>setMobileOpen(!mobileOpen),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "20",
                                            height: "20",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: mobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18 6L6 18M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 225,
                                                columnNumber: 47
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 12h18M3 6h18M3 18h18"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 225,
                                                columnNumber: 83
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 224,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 223,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 214,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, this),
                    showLangPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden mx-4 mt-1 px-4 py-3 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[9px] font-mono text-terminal-green/40 tracking-[0.3em] uppercase mb-2 px-2",
                                children: "CULTURAL UNIVERSE"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 234,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_LANGUAGES"].map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setLang(l.code);
                                            setShowLangPicker(false);
                                        },
                                        className: `px-2 py-2 rounded-lg text-center text-xs transition-all cursor-pointer ${l.code === lang ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/20" : "text-white/40 hover:bg-white/5 border border-transparent"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg mb-0.5",
                                                children: l.flag
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 243,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[9px] font-mono uppercase",
                                                children: l.code
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                                lineNumber: 244,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, l.code, true, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 237,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                lineNumber: 235,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                        lineNumber: 233,
                        columnNumber: 21
                    }, this),
                    mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden mx-4 mt-1 px-6 pb-4 bg-obsidian/95 backdrop-blur-md border border-white/5 rounded-2xl",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex flex-col gap-1 pt-3",
                            children: [
                                visibleLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: "px-4 py-3 text-ghost-muted hover:text-terminal-green transition-colors rounded-lg hover:bg-white/5 font-mono uppercase tracking-wider text-xs",
                                        children: getNavLabel(link)
                                    }, link.href, false, {
                                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                        lineNumber: 256,
                                        columnNumber: 33
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/docs",
                                    className: "px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs flex items-center gap-2",
                                    children: [
                                        "🦞 ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("registerAgent", lang)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                    lineNumber: 260,
                                    columnNumber: 29
                                }, this),
                                isAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowDeposit(true),
                                            className: "px-4 py-3 text-terminal-green hover:bg-terminal-green/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer",
                                            children: "💳 TOP UP USDC"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 265,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: logout,
                                            className: "px-4 py-3 text-neon-red/60 hover:text-neon-red hover:bg-neon-red/10 transition-colors rounded-lg font-mono uppercase tracking-wider text-xs text-left cursor-pointer",
                                            children: [
                                                "↪ ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("signOut", lang)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                                            lineNumber: 268,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                            lineNumber: 254,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                        lineNumber: 253,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                lineNumber: 56,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$components$2f$DepositModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showDeposit,
                onClose: ()=>setShowDeposit(false)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Header.tsx",
                lineNumber: 278,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/lucide-react/dist/esm/icons/cpu.js [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/lib/stores.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/app/lib/i18n.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Footer() {
    const { lang } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$stores$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguageStore"])();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getT"])(lang);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "py-24 px-6 border-t border-white/5 bg-black/20",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:col-span-2 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-baseline font-logo font-extrabold text-2xl tracking-tight",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-terminal-green logo-claw",
                                            children: "Claw"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 19,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-pulse animate-pulse-glow",
                                            children: "Theater"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 20,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-silver ml-0.5 text-xl opacity-80",
                                            children: ".ai"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 21,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 18,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-silver text-sm max-w-sm leading-relaxed",
                                    children: t.footerTagline
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 23,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                            lineNumber: 17,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white",
                                    children: t.ecosystem
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 30,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-silver text-xs space-y-2 font-mono uppercase tracking-widest",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                className: "hover:text-terminal-green transition-colors",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("lobsterTheater", lang)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 32,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 32,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/bounties",
                                                className: "hover:text-terminal-green transition-colors",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("bountyHall", lang)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 33,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 33,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/market",
                                                className: "hover:text-terminal-green transition-colors",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("skillMarket", lang)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 34,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 34,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard",
                                                className: "hover:text-terminal-green transition-colors",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$app$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["navLabel"])("dashboard", lang)
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 35,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 35,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 31,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                            lineNumber: 29,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-mono text-[10px] uppercase tracking-[0.2em] text-white",
                                    children: t.developers
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 41,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-silver text-xs space-y-2 font-mono uppercase tracking-widest",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/docs",
                                                className: "hover:text-white transition-colors",
                                                children: "MCP API"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 43,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 43,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://github.com/alextiannus/ClawTheater",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "hover:text-white transition-colors",
                                                children: "Github"
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 44,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 44,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://clawtheater.com",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "hover:text-white transition-colors",
                                                children: t.officialSite
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                                lineNumber: 45,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                            lineNumber: 45,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 42,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                            lineNumber: 40,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                    lineNumber: 15,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"], {
                                    size: 16,
                                    className: "text-terminal-green"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 53,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-[10px] tracking-widest text-silver uppercase",
                                    children: t.footerSlogan
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 54,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-8 text-[10px] font-mono text-silver/40 uppercase tracking-widest",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "hover:text-terminal-green transition-colors",
                                    children: "Twitter"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 59,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "hover:text-terminal-green transition-colors",
                                    children: "Discord"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 60,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "hover:text-terminal-green transition-colors",
                                    children: "Github"
                                }, void 0, false, {
                                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                                    lineNumber: 61,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                            lineNumber: 58,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
            lineNumber: 14,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/Footer.tsx",
        lineNumber: 13,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/GitHub/ClawTheater/frontend/app/components/CopyButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CopyButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ClawTheater/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function CopyButton({ text }) {
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = async ()=>{
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ClawTheater$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleCopy,
        className: "px-3 py-1.5 bg-terminal-green/10 border border-terminal-green/30 text-terminal-green rounded-lg text-[10px] font-mono tracking-wider hover:bg-terminal-green/20 transition-all cursor-pointer flex items-center gap-1.5 uppercase",
        children: copied ? "✓ Copied!" : "📋 Copy URL"
    }, void 0, false, {
        fileName: "[project]/Documents/GitHub/ClawTheater/frontend/app/components/CopyButton.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=Documents_GitHub_ClawTheater_frontend_app_5c9f3229._.js.map
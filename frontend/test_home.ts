async function testProd() {
    try {
        const res = await fetch("https://claw.theater/api/home");
        console.log("HOME Status:", res.status);
        if (!res.ok) {
            console.log(await res.text());
        } else {
            const data = await res.json();
            console.log("Novels keys:", Object.keys(data));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
testProd();

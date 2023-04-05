import { ACCOUNTS, getNFT, setNFTSignature, signNFT, watchNewNFT } from "./lib.js";
import { finishExecution } from "./tracker.js";

watchNewNFT(ACCOUNTS[0], async (id) => {
    try {
        const nft = await getNFT(ACCOUNTS[0], Number(id));
        const signature = signNFT(nft);

        await setNFTSignature(ACCOUNTS[0], nft.id, signature);

    } catch(e) {
        console.error(e);
    }
});

process.on('SIGINT', function() {
    finishExecution();
});
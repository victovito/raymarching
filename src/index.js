import Program from "./classes/program";

const init = () => {
    const program = new Program(document.querySelector("#canvas"));
    console.log("Started...", program);
}

document.body.onload = init;
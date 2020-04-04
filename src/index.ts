import { Storage } from "./libs/Storage";
import { Data } from "./libs/Data";
import { addDefinitions } from "./definitions";
import html from "./template/main.html";
import css from "./template/main.scss";

const model = new Storage<Data>("demo");

addDefinitions(model);

document.body.innerHTML = `${html}<style>${css}</style>`;

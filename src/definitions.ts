import { define, create, at, DefinedHTMLElement } from "slot";
import { Storage } from "./libs/Storage";
import { Data } from "./libs/Data";

export function addDefinitions (model: Storage): void {

  define("demo-app", {
    style: /*css*/`
      :host {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background: #EEEEEE;
      }
    `,
    render: () => /*html*/`<slot></slot>`
  });

  define("demo-item", {
    attributesSchema: {
      selected: {
        type: Boolean,
        observed: true
      }
    },
    style: /*css*/`

      :host {
        display: block;
        border-bottom: 1px solid #CCCCCC;
        cursor: pointer;
      }
      :host:nth-of-type(odd) {
        background-color: #F8F8F8;
      }
      :host:hover {
        background-color: #DDEEFF;
      }

      div {
        padding: 0.5em 1em;
        line-height: 1em;
      }
      .selected {
        background: #336699;
        color: #FFFFFF;
      }
    `,
    render: () => {
      return create<HTMLDivElement>("div", null, [["slot"]]);
    },
    controller: ({ elementNode, shadowDOMAccess: SDW }) => {

      const updateSelected = (): void => {
        SDW.$("div").classList.toggle("selected", elementNode.getAttributeValue("selected"));
      };

      updateSelected();

      return {
        attributeChangedCallback: (name: string): void => {
          if(name === "selected") {
            updateSelected();
          }
        }
      };
    }
  });

  define("demo-list", {
    style: /*css*/`
      :host {
        display: block;
        width: 25%;
        background: #FFFFFF;
      }
      #list {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    `,
    render: () => /*html*/`<div id="list"><slot></slot></div>`,
    controller: ({ elementNode }) => {
      let selectedItem: any;
      const updateList = (): void => {
        const $f = document.createDocumentFragment();
        model.getList().forEach((item) => {
          const itemNode = create<DefinedHTMLElement>("demo-item", {
            selected: (selectedItem === item ? "true" : "false")
          }, [ item.title ]);
          itemNode.addEventListener("click", () => {
            selectedItem = item;
            elementNode.fireEvent("itemSelected", item);
            updateList();
          });
          $f.appendChild(itemNode);
        });
        elementNode.innerHTML = "";
        elementNode.appendChild($f);
      };
      model.onupdate.subscribe(() => {
        updateList();
      });

      updateList();
    }
  });

  define("demo-detail", {
    style: /*css*/`
      :host {
        flex: 1;
      }
      * {
        box-sizing: border-box;
      }
      div {
        padding: 0em 1em;
        margin: 1em 0em;
      }
      input, textarea {
        width: 100%;
        border: 1px solid #999999;
        padding: 1em;
        height: 3em;
        line-height: 1em;
        font-size: 14px;
      }
      input:focus, textarea:focus {
        border-color: #336699;
      }
      textarea {
        height: 10em;
      }
    `,
    render: () => /*html*/`
      <form id="form">
        <div>
          <input type="text" name="title" placeholder="Title" />
        </div>
        <div>
          <textarea name="body" placeholder="Body"></textarea>
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    `,
    controller: ({ shadowDOMAccess: SDW }) => {
      let selectedData: Data;
      const $form = SDW.$("#form") as HTMLFormElement;

      at($form, "submit", (e) => {
        e.preventDefault();
        const data = new FormData($form);
        const dataObj = Object.fromEntries((data as any).entries());

        if(selectedData) {
          model.replace(selectedData, dataObj);
        } else {
          model.add(dataObj);
        }

        selectedData = null;
        $form.reset();
      });

      at("demo-list", "itemSelected", (event: CustomEvent<Data>): void => {
        selectedData = event.detail;
        SDW.$<HTMLInputElement>(`[name="title"]`).value = event.detail.title;
        SDW.$<HTMLTextAreaElement>(`[name="body"]`).value = event.detail.body;
      });
    }
  });

}

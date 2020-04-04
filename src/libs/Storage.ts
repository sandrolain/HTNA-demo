import { Emitter } from "synapse";

export class Storage<T=any> {
  storageName: string;
  data: T[] = [];
  readonly onupdate: Emitter;

  constructor (storageName: string) {
    this.storageName = storageName;
    this.load();
    this.onupdate = new Emitter();
  }

  getList (): T[] {
    return this.data.slice();
  }

  add (item: T): boolean {
    this.data.push(item);

    if(this.save()) {
      this.onupdate.emit();
      return true;
    }

    this.data.pop();
    return false;
  }

  remove (item: T): void {
    const index = this.data.indexOf(item);
    if(index > -1) {
      this.data.splice(index, 1);
      this.save();
      this.onupdate.emit();
    }
  }

  replace (oldItem: T, item: T): void {
    const index = this.data.indexOf(oldItem);
    if(index > -1) {
      this.data.splice(index, 1, item);
    } else {
      this.data.push(item);
    }
    this.save();
    this.onupdate.emit();
  }

  load (): void {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageName));
      if(data) {
        this.data = data;
      }
    } catch(e) {
      e;
    }
  }

  save (): boolean {
    try {
      localStorage.setItem(this.storageName, JSON.stringify(this.data));
      return true;
    } catch(e) {
      e;
    }
    return false;
  }
}

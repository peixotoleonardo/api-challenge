export interface MenuProperty {
  name: string;
  relatedId?: string;
}

export class Menu {
  get name() {
    return this.props.name;
  }

  get relatedId() {
    return this.props.relatedId;
  }

  private constructor(private props: MenuProperty) { }

  static create(props: MenuProperty) {
    return new this({ ...props });
  }
}
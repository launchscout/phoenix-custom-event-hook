const PhxCustomEvent = {
  mounted() {
    const attrs = this.el.attributes;
    for (var i = 0; i < attrs.length; i++) {
      if (/^phx-custom-event-/.test(attrs[i].name)) {
        const eventName = attrs[i].name.replace("phx-custom-event-", "");
        const phxEvent = attrs[i].value
        this.el.addEventListener(eventName, ({ detail }) => {
          this.pushEvent(phxEvent, detail);
        });
      }
    }
  }
}

export default PhxCustomEvent;
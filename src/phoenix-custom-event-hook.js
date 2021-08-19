const PhxCustomEvent = {
  mounted() {
    const attrs = this.el.attributes;
    const phxTarget = attrs["phx-target"].value;
    const pushEvent = phxTarget
      ? (event, payload, callback) =>
          this.pushEventTo(phxTarget, event, payload, callback)
      : this.pushEvent;

    for (var i = 0; i < attrs.length; i++) {
      if (/^phx-custom-event-/.test(attrs[i].name)) {
        const eventName = attrs[i].name.replace("phx-custom-event-", "");
        const phxEvent = attrs[i].value;
        this.el.addEventListener(eventName, ({ detail }) => {
          this.el.dispatchEvent(
            new CustomEvent("phx-event-start", {
              detail: { name: eventName, payload: detail },
            })
          );
          pushEvent(phxEvent, detail, (e) => {
            this.el.dispatchEvent(
              new CustomEvent("phx-event-complete", {
                detail: { name: eventName, payload: detail },
              })
            );
          });
        });
      }
    }
    if (this.el.getAttribute("phx-receive-events")) {
      const phoenixEvents = this.el
        .getAttribute("phx-receive-events")
        .split(",");
      phoenixEvents.forEach((evt) => {
        this.handleEvent(evt, (payload) => {
          this.el.dispatchEvent(new CustomEvent(evt, { detail: payload }));
        });
      });
    }
  },
};

export default PhxCustomEvent;

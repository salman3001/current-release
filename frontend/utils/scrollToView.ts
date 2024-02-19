export const srollToView = (ref: any) =>
  ref.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  });

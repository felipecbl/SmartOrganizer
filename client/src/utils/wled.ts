export const resetWled = async (url: string) => {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ on: true, bri: 255, seg: { id: 0, i: [0, 64, "000000"] } }),
  });
};

export const findLocation = async (server: string, index: number, quantity: number) => {
  const url = `http://${server}.local/json`;
  await resetWled(url);
  const red = "ff0000";
  const green = "00ff00";
  const yellow = "ffff00";
  let color = red;

  if (quantity >= 10) color = green;
  if (quantity > 0 && quantity < 10) color = yellow;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ on: true, bri: 255, seg: { id: 0, i: [index, color] } }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

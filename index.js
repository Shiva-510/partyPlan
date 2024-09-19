const COHORT = "2408-Shiva";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

let parties = [];

const getParties = async () => {
  try {
    const response = await fetch(API_URL);
    const parsed = await response.json();
    parties = parsed.data;
  } catch (error) {
    console.error(error);
  }
};

const addParty = async (party) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });
    if (!response.ok) {
      const parsed = await response.json();
      throw new Error(parsed.error.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteParty = async (id) => {
  try {
    const response = await fetch(API_URL + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      const parsed = await response.json();
      throw new Error(parsed.error.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const renderParties = () => {
  const $partyList = document.querySelector("ul.parties");

  if (!parties.length) {
    $partyList.innerHTML = `
      <li>No parties near you :(</li>
    `;
    return;
  }

  const $parties = parties.map((party) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
      <h3>${party.name}</h3>
      <time datetime="${party.date}">${party.date.slice(0, 10)}</time>
      <address>${party.location}</address>
      <p>${party.description}</p>
      <button>Delete Party</button>
    `;

    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
      await deleteParty(party.id);
      await getParties();
      renderParties();
    });

    return $li;
  });

  $partyList.replaceChildren(...$parties);
};

const init = async () => {
  await getParties();
  renderParties();
};

init();

const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const date = new Date($form.date.value).toISOString();
  const party = {
    name: $form.name.value,
    description: $form.description.value,
    date,
    location: $form.location.value,
  };

  await addParty(party);

  await getParties();
  renderParties();
});
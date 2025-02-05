import moment from "moment";

export function getCookie(name) {
  try {
    const value = localStorage.getItem(name);
    return value || null;
  } catch (error) {
    console.error("Error getting item from localStorage:", error);
    return null;
  }
}

// Optional: You might want to add a setCookie function as well
export function setCookie(name, value) {
  try {
    localStorage.setItem(name, value);
    return true;
  } catch (error) {
    console.error("Error setting item in localStorage:", error);
    return false;
  }
}

// Optional: And a removeCookie function
export function removeCookie(name) {
  try {
    localStorage.removeItem(name);
    return true;
  } catch (error) {
    console.error("Error removing item from localStorage:", error);
    return false;
  }
}

export function printer_bill(
  ticket_id,
  draw_time,
  ticket_time,
  play_point,
  betNumList
) {

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const pairedItems = chunkArray(
    betNumList.filter((e) => e.token !== "" && e.token !== null),
    2
  );

  const billHTML = /*html*/ `
  <div class="bill">
  <p style="margin-bottom: 4px;">***Super Chance***</p>
  <p style="margin-bottom: 4px;">From Amusement Only re-print</p>
  <p style="margin-bottom: 4px;">Agent: 634</p>
  <p style="margin-bottom: 4px;">Game ID: ${ticket_id}</p>
  <p style="margin-bottom: 4px;">Game Name: Single Chance</p>
  <p style="margin-bottom: 4px;">Draw Time: ${draw_time}</p>
  <p style="margin-bottom: 4px;">Ticket Time: ${ticket_time}</p>
  <p style="margin-bottom: 4px;">Total Point: ${play_point}</p>
  <div style="display: flex; align-items: flex-start; gap: 14px;">
      <table>
        <tr>
          <th style="padding-right: 14px;">Item</th>
          <th style="padding-right: 14px;">Point</th>
          <th style="padding-right: 14px;">Item</th>
          <th>Point</th>
        </tr>
        ${pairedItems
          .map(
            (pair) => `
            <tr>
              <td>${pair[0]?.num || ""}</td>
              <td>${pair[0]?.token || ""}</td>
              <td>${pair[1]?.num ?? ""}</td>
              <td>${pair[1]?.token || ""}</td>
            </tr>
          `
          )
          .join("")}
      </table>
    </div>
  </div>
  `;

  window.electronAPI.printBill(billHTML, ticket_id);
}

// import moment from "moment";

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
    betNumList.filter((e) => e.played !== "" && e.played !== null),
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
              <td>${pair[0]?.bet ?? ""}</td>
              <td>${pair[0]?.played || ""}</td>
              <td>${pair[1]?.bet ?? ""}</td>
              <td>${pair[1]?.played || ""}</td>
            </tr>
          `
          )
          .join("")}
      </table>
    </div>
  </div>
  `;
  // console.log("bill html isher 💁👌🎍😍", billHTML);

  window.electronAPI.printBill(billHTML);
}

export function printReport(fromDate, toDate, salePoint, winPoint, end, ntp) {

  // play, win, claim, unclaim, end, ntp
  // const billHTML = /*html*/ `
  // <div class="bill">
  // <p style="margin-bottom: 4px;">***Super Chance***</p>
  // <p style="margin-bottom: 4px;">From Amusement Only re-print</p>
  // <p style="margin-bottom: 4px;">Agent: 634</p>
  // <table>
  // <tr>
  //   <th style="padding-right: 6px;">PLAYED</th>
  //   <th style="padding-right: 6px;">WON</th>
  //   <th style="padding-right: 6px;">CLAIM</th>
  //   <th style="padding-right: 6px;">UNCLAIM</th>
  //   <th style="padding-right: 6px;">END</th>
  //   <th>NTP</th>
  // </tr>
  // <tr>
  //   <td>${play}</td>
  //   <td>${win}</td>
  //   <td>${claim}</td>
  //   <td>${unclaim}</td>
  //   <td>${end}</td>
  //   <td>${ntp}</td>
  // </tr>
  // </table>
  // `;

  const billHTML = /*html*/ `
  <div>
  <p style="margin-bottom: 4px;">***Super Chance***</p>
  <p style="margin-bottom: 4px;">From Amusement Only</p>
  <p style="margin-bottom: 4px;">Agent: 634</p>
  <p style="margin-bottom: 4px;">Game Name: Single Chance</p>
  <p style="margin-bottom: 4px;">From Date: ${fromDate}</p>
  <p style="margin-bottom: 4px;">To Date: ${toDate}</p>
  <p style="margin-bottom: 4px;">Sale Point: ${salePoint}</p>
  <p style="margin-bottom: 4px;">Win Point: ${winPoint}</p>
  <p style="margin-bottom: 4px;">End Point: ${end}</p>
  <p style="margin-bottom: 4px;">NTP Point: ${ntp}</p>
  </div>
  `;

  window.electronAPI.printBill(billHTML);
}

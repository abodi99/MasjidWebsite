document.addEventListener("DOMContentLoaded", async () => {

    const url = "https://time.my-masjid.com/api/TimingsInfoScreen/GetMasjidTimings";
    
    const params = {
        "GuidId": "ee787ee0-549f-43f3-9fe4-9c8bc3c295f7" // Al Salam moske ID
    };

    try {
        console.log("Sending API request...");

        const response = await fetch(url + "?" + new URLSearchParams(params), {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        // Calculate today's day of the year
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 0);
        const diff = currentDate - startDate;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        console.log("Today's Day of Year:", dayOfYear); // Debugging

        const prayerTimes = {
            Fajr: data.model.salahTimings[dayOfYear - 1].fajr,
            Dhuhr: data.model.salahTimings[dayOfYear - 1].zuhr,
            Asr: data.model.salahTimings[dayOfYear - 1].asr,
            Maghrib: data.model.salahTimings[dayOfYear - 1].maghrib,
            Isha: data.model.salahTimings[dayOfYear - 1].isha
        };
        const iqamahTimes = {
            Fajr: data.model.salahTimings[dayOfYear - 1].iqamah_Fajr,
            Dhuhr: data.model.salahTimings[dayOfYear - 1].iqamah_Zuhr,
            Asr: data.model.salahTimings[dayOfYear - 1].iqamah_Asr,
            Maghrib: data.model.salahTimings[dayOfYear - 1].iqamah_Maghrib,
            Isha: data.model.salahTimings[dayOfYear - 1].iqamah_Isha
        };

        console.log("Parsed Prayer Times:", prayerTimes); // Debugging 

        // Update the table with prayer times
        updatePrayerTimes(prayerTimes, iqamahTimes);

    } catch (error) {
        console.error("Error fetching or parsing prayer times:", error);

        document.getElementById("prayer-times").innerHTML = `
            <tr><td colspan="3" class="text-center text-danger">Failed to load prayer times. Please try again later.</td></tr>
        `;
    }
});

function updatePrayerTimes(prayerTimes, iqamahTimes) {
    console.log("Updating table with prayer times...");  // Debugging

    const tableBody = document.getElementById("prayer-times");
    tableBody.innerHTML = ""; // Clear existing content

    for (const prayer in prayerTimes) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const timeCell = document.createElement("td");
        const iqamahCell = document.createElement("td"); 

        nameCell.textContent = prayer; 
        timeCell.textContent = prayerTimes[prayer]; 
        iqamahCell.textContent = iqamahTimes[prayer];

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(iqamahCell);
        tableBody.appendChild(row);
    }
}

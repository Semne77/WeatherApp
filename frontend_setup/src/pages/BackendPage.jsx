import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchHistory from "../components/SearchHistory";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function BackendPage() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiReport, setAiReport] = useState("");

  // Called when user selects a location from autocomplete
  const handleLocationSelect = (lat, lng, description) => {
    setLatLng({ lat, lng });
    setLocation(description);
  };

  // Generate and download a PDF report
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Tennis Tournament Weather Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Location: ${weatherData.location}`, 14, 30);
    doc.text(`Date Range: ${weatherData.start_date} to ${weatherData.end_date}`, 14, 36);
    doc.text(`Created: ${new Date(weatherData.created_at).toLocaleString()}`, 14, 42);

    const headers = [["Date", "Min Temp (°C)", "Max Temp (°C)"]];
    const rows = weatherData.weather_data[0].daily.time.map((date, idx) => [
      date,
      weatherData.weather_data[0].daily.temperature_2m_min[idx],
      weatherData.weather_data[0].daily.temperature_2m_max[idx],
    ]);
    autoTable(doc, { head: headers, body: rows, startY: 50 });

    const reportY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("AI Tournament Advice", 14, reportY);

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(aiReport, 180);
    doc.text(lines, 14, reportY + 6);

    doc.save("weather_report.pdf");
  };

  // Request AI tournament recommendation
  const handleGenerateAdvice = async () => {
    const response = await fetch("http://localhost:5001/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: weatherData.location,
        start_date: weatherData.start_date,
        end_date: weatherData.end_date,
        forecast: weatherData.weather_data[0].daily,
      }),
    });

    const data = await response.json();
    setAiReport(data.report || "⚠️ Failed to generate advice.");
  };

  // Submit form to save and fetch weather data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      alert("❌ End date must be later than or equal to start date.");
      return;
    }

    const postRes = await fetch("http://localhost:5001/api/weather-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, start_date: startDate, end_date: endDate }),
    });

    const postData = await postRes.json();
    if (!postRes.ok) {
      alert("❌ Failed to save data: " + postData.error);
      return;
    }

    const getRes = await fetch(
      `http://localhost:5001/api/weather-query?location=${encodeURIComponent(
        location
      )}&start_date=${startDate}&end_date=${endDate}`
    );

    const getData = await getRes.json();
    if (getRes.ok) {
      setWeatherData(getData);
      setRefreshKey((prev) => prev + 1);
    } else {
      alert("⚠️ Could not fetch saved data: " + getData.error);
      setWeatherData(null);
    }
  };

  // Load weather data from a previous search
  const handleReRun = async (entry) => {
    setLocation(entry.location);
    setStartDate(entry.start_date);
    setEndDate(entry.end_date);
    document.querySelector("form").scrollIntoView({ behavior: "smooth" });

    try {
      const res = await fetch(
        `http://localhost:5001/api/weather-query?location=${encodeURIComponent(
          entry.location
        )}&start_date=${entry.start_date}&end_date=${entry.end_date}`
      );
      const data = await res.json();
      if (res.ok) {
        setWeatherData(data);
      } else {
        alert("❌ Could not fetch weather data: " + data.error);
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Weather Query Form</h1>

      {/* Form for location and date input */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl p-6 shadow-lg max-w-3xl mx-auto mb-8"
      >
        <div className="mb-4">
          <SearchBar
            address={location}
            setAddress={setLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="bg-gray-700 text-white px-4 py-2 rounded w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="bg-gray-700 text-white px-4 py-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Submit Query
        </button>
      </form>

      {/* Weather table display */}
      {weatherData && weatherData.weather_data?.[0]?.daily?.time && (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Weather Data for {weatherData.location}
          </h2>
          <p><strong>From:</strong> {weatherData.start_date}</p>
          <p><strong>To:</strong> {weatherData.end_date}</p>
          <p><strong>Created:</strong> {new Date(weatherData.created_at).toLocaleString()}</p>

          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Min Temp (°C)</th>
                <th className="px-4 py-2">Max Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.weather_data[0].daily.time.map((date, index) => (
                <tr key={date} className="text-center border-t border-gray-700">
                  <td className="px-4 py-2">{date}</td>
                  <td className="px-4 py-2">
                    {weatherData.weather_data[0].daily.temperature_2m_min[index]}
                  </td>
                  <td className="px-4 py-2">
                    {weatherData.weather_data[0].daily.temperature_2m_max[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI summary and export */}
      {weatherData && (
        <div className="text-center mt-4">
          <button
            onClick={handleGenerateAdvice}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
          >
            Generate AI Report for Tournament
          </button>
          {aiReport && (
            <div className="mt-4 bg-gray-700 p-4 rounded text-left">
              <h3 className="font-bold mb-2">🏟️ AI Tournament Advice</h3>
              <p>{aiReport}</p>
            </div>
          )}
        </div>
      )}

      {aiReport && (
        <div className="text-center mt-4">
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          >
            Export to PDF
          </button>
        </div>
      )}

      {/* Search history display */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg max-w-4xl mx-auto">
        <SearchHistory refreshKey={refreshKey} onReRun={handleReRun} />
      </div>
    </div>
  );
}

export default BackendPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAPICall } from "../../../util/api";

const BookedPersons = () => {
  const [data, setData] = useState({});
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAPICall(
        "/api/getBookedPerson"
      );

      setData(res);

      // default select first event
      const firstKey = Object.keys(res.data)[0];
      setSelectedEvent(firstKey);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Booked Persons</h3>

      {/* Event Filter */}
      <div className="mb-3">
        <label>Select Event</label>
        <select
          className="form-control"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {Object.keys(data).map((event) => {
            const [title, date] = event.split("|");
            return (
              <option key={event} value={event}>
                {title} - {date}
              </option>
            );
          })}
        </select>
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Event</th>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>

        <tbody>
          {data[selectedEvent]?.map((person, index) => {
            const [title, date] = selectedEvent.split("|");

            return (
              <tr key={person.id}>
                <td>{index + 1}</td>
                <td>{title}</td>
                <td>{date}</td>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.age}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookedPersons;
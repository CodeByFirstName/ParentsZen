import React, { useState } from "react";

const initialFilters = {
  location: "",
  budget: "",
  day: "",
  gender: "",
};

export default function FiltersPanel({ onFilterChange }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <div className="border-2 border-emerald-200 rounded-2xl p-6 bg-white shadow-sm mb-10">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Ville */}
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Ville"
          className="border rounded-lg p-3 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />

        {/* Budget */}
        <input
          type="number"
          name="budget"
          value={filters.budget}
          onChange={handleChange}
          placeholder="Budget max (FCFA)"
          min="1000"
          className="border rounded-lg p-3 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />

        {/* Jour */}
        <select
          name="day"
          value={filters.day}
          onChange={handleChange}
          className="border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        >
          <option value="">Jour</option>
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map(
            (d) => (
              <option key={d} value={d}>
                {d}
              </option>
            )
          )}
        </select>

        {/* Genre */}
        <div className="flex items-center gap-6 col-span-full">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="gender"
              value="Femme"
              checked={filters.gender === "Femme"}
              onChange={handleChange}
              className="accent-orange-500"
            />
            Femme
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="gender"
              value="Homme"
              checked={filters.gender === "Homme"}
              onChange={handleChange}
              className="accent-orange-500"
            />
            Homme
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="gender"
              value=""
              checked={filters.gender === ""}
              onChange={handleChange}
              className="accent-orange-500"
            />
            Tous
          </label>
        </div>

        {/* Boutons */}
        <div className="col-span-full flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 hover:underline"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}

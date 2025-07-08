import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Pencil, Trash2 } from 'lucide-react';

const PrometheeProses = () => {
  // Key untuk localStorage yang sama dengan halaman kriteria
  const LOCAL_STORAGE_KEY = 'criteriaData';

  // State untuk data kriteria dari localStorage
  const [criteriaData, setCriteriaData] = useState([]);

  // State untuk menyimpan indeks preferensi per kriteria (Tabel 3)
  const [preferenceIndexes, setPreferenceIndexes] = useState({});

  // State baru untuk menyimpan indeks preferensi multikriteria (Tabel 4.9)
  const [multiCriteriaPreferenceIndexes, setMultiCriteriaPreferenceIndexes] = useState({});

  // useEffect untuk memuat data kriteria dari localStorage saat komponen dimuat
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setCriteriaData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse criteria data from localStorage:", error);
    }
  }, []); // [] agar hanya dijalankan sekali saat mount

  // Fungsi pembantu untuk mendapatkan sub-kriteria berdasarkan nama kriteria
  const getSubCriteriaOptions = (criteriaName) => {
    const criteria = criteriaData.find(c => c.kriteria === criteriaName);
    return criteria ? criteria.subCriteria : [];
  };

  // --- State untuk Form Tambah Toko ---
  const [namaToko, setNamaToko] = useState('');
  const [harga, setHarga] = useState('');
  const [kualitas, setKualitas] = useState('');
  const [garansi, setGaransi] = useState('');
  const [ketersediaanBarang, setKetersediaanBarang] = useState('');
  const [lamaKredit, setLamaKredit] = useState('');

  // --- State untuk Data Tabel Toko ---
  const [daftarToko, setDaftarToko] = useState(() => {
    try {
      const storedToko = localStorage.getItem('daftarToko');
      return storedToko ? JSON.parse(storedToko) : [];
    } catch (error) {
      console.error("Failed to parse daftarToko from localStorage:", error);
      return [];
    }
  });

  // useEffect untuk menyimpan daftarToko ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('daftarToko', JSON.stringify(daftarToko));
    // Panggil fungsi perhitungan indeks preferensi setiap kali daftarToko atau criteriaData berubah
    if (daftarToko.length >= 2 && criteriaData.length > 0) {
      calculatePreferenceIndexes();
    } else {
      setPreferenceIndexes({}); // Reset jika tidak ada cukup toko atau kriteria
      setMultiCriteriaPreferenceIndexes({}); // Reset juga tabel multikriteria
    }
  }, [daftarToko, criteriaData]);

  // useEffect untuk menghitung indeks preferensi multikriteria setelah preferenceIndexes diupdate
  useEffect(() => {
    if (Object.keys(preferenceIndexes).length > 0 && criteriaData.length > 0) {
      calculateMultiCriteriaPreferenceIndexes();
    } else {
      setMultiCriteriaPreferenceIndexes({});
    }
  }, [preferenceIndexes, criteriaData]); // Tergantung pada preferenceIndexes dan criteriaData

  // --- State untuk Pencarian dan Pagination Tabel ---
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // --- Fungsi untuk menghitung Indeks Preferensi (Tabel 3) ---
  const calculatePreferenceIndexes = () => {
    const indexes = {};

    for (let i = 0; i < daftarToko.length; i++) {
      for (let j = 0; j < daftarToko.length; j++) {
        if (i === j) continue;

        const tokoA = daftarToko[i];
        const tokoB = daftarToko[j];
        const pairKey = `${tokoA.nama.toLowerCase()},${tokoB.nama.toLowerCase()}`;

        indexes[pairKey] = {};

        criteriaData.forEach(criteria => {
          const critKey = criteria.kriteria.toLowerCase().replace(/\s/g, '');

          if (tokoA.nilaiKriteria && tokoB.nilaiKriteria &&
              tokoA.nilaiKriteria[critKey] !== undefined &&
              tokoB.nilaiKriteria[critKey] !== undefined) {

            const valueA = tokoA.nilaiKriteria[critKey];
            const valueB = tokoB.nilaiKriteria[critKey];

            const d = valueA - valueB;

            let H_d;
            if (d > 0) {
              H_d = 1;
            } else {
              H_d = 0;
            }
            indexes[pairKey][critKey] = { d: d, H_d: H_d };
          } else {
            indexes[pairKey][critKey] = { d: 'N/A', H_d: 'N/A' };
          }
        });
      }
    }
    setPreferenceIndexes(indexes);
  };

  // --- Fungsi baru untuk menghitung Indeks Preferensi Multikriteria (Tabel 4.9) ---
  const calculateMultiCriteriaPreferenceIndexes = () => {
    const multiIndexes = {};
    const numberOfCriteria = criteriaData.length;

    if (numberOfCriteria === 0) return; // Hindari pembagian dengan nol

    for (let i = 0; i < daftarToko.length; i++) {
      for (let j = 0; j < daftarToko.length; j++) {
        const tokoA = daftarToko[i];
        const tokoB = daftarToko[j];

        if (i === j) {
          multiIndexes[`${tokoA.nama.toLowerCase()},${tokoB.nama.toLowerCase()}`] = '-'; // Diagonal
          continue;
        }

        const pairKey = `${tokoA.nama.toLowerCase()},${tokoB.nama.toLowerCase()}`;
        let sum_H_d = 0;
        let valid_criteria_count = 0;

        // Iterasi semua kriteria untuk pasangan ini
        criteriaData.forEach(criteria => {
          const critKey = criteria.kriteria.toLowerCase().replace(/\s/g, '');
          const preferenceData = preferenceIndexes[pairKey];

          if (preferenceData && preferenceData[critKey] && typeof preferenceData[critKey].H_d === 'number') {
            sum_H_d += preferenceData[critKey].H_d;
            valid_criteria_count++;
          }
        });

        // Hitung phi(a,b) = (1/n) * SUM(H(d))
        // Gunakan valid_criteria_count agar lebih robust jika ada kriteria "N/A"
        const phi = valid_criteria_count > 0 ? (sum_H_d / valid_criteria_count).toFixed(2) : 'N/A'; // Batasi 2 desimal

        multiIndexes[`${tokoA.nama.toLowerCase()},${tokoB.nama.toLowerCase()}`] = phi;
      }
    }
    setMultiCriteriaPreferenceIndexes(multiIndexes);
  };


  // --- Handler untuk Form Tambah Toko ---
  const handleTambahToko = () => {
    if (!namaToko || !harga || !kualitas || !garansi || !ketersediaanBarang || !lamaKredit) {
      alert('Semua field harus diisi!');
      return;
    }

    const getNumericValue = (criteriaName, selectedSubCriteriaName) => {
        const criteria = criteriaData.find(c => c.kriteria.toLowerCase() === criteriaName.toLowerCase());
        if (criteria) {
            const sub = criteria.subCriteria.find(s => s.name === selectedSubCriteriaName);
            return sub ? sub.value : 0;
        }
        return 0;
    };

    const newToko = {
        id: `toko-${Date.now()}`,
        no: daftarToko.length > 0 ? Math.max(...daftarToko.map(t => t.no)) + 1 : 1,
        nama: namaToko,
        harga: harga,
        kualitas: kualitas,
        garansi: garansi,
        ketersediaanBarang: ketersediaanBarang,
        lamaKredit: lamaKredit,
        nilaiKriteria: {},
        entringFlow: 0,
        leavingFlow: 0,
        get netFlow() {
          return this.entringFlow - this.leavingFlow;
        }
      };

    criteriaData.forEach(crit => {
        const keyName = crit.kriteria.toLowerCase().replace(/\s/g, '');
        let selectedValue;
        if (crit.kriteria === 'Harga') selectedValue = harga;
        else if (crit.kriteria === 'Kualitas') selectedValue = kualitas;
        else if (crit.kriteria === 'Garansi') selectedValue = garansi;
        else if (crit.kriteria === 'Ketersediaan Barang') selectedValue = ketersediaanBarang;
        else if (crit.kriteria === 'Lama Kredit') selectedValue = lamaKredit;

        newToko.nilaiKriteria[keyName] = getNumericValue(crit.kriteria, selectedValue);
    });

    setDaftarToko([...daftarToko, newToko]);

    setNamaToko('');
    setHarga('');
    setKualitas('');
    setGaransi('');
    setKetersediaanBarang('');
    setLamaKredit('');
    alert('Toko berhasil ditambahkan!');
  };

  // --- Handler untuk Edit/Delete Toko (di tabel) ---
  const handleEditToko = (tokoId) => {
    const tokoToEdit = daftarToko.find(toko => toko.id === tokoId);
    if (tokoToEdit) {
        setNamaToko(tokoToEdit.nama);
        setHarga(tokoToEdit.harga);
        setKualitas(tokoToEdit.kualitas);
        setGaransi(tokoToEdit.garansi);
        setKetersediaanBarang(tokoToEdit.ketersediaanBarang);
        setLamaKredit(tokoToEdit.lamaKredit);
        alert(`Edit Toko: ${tokoToEdit.nama}`);
    }
  };

  const handleDeleteToko = (tokoId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus toko ini?`)) {
      setDaftarToko(daftarToko.filter(toko => toko.id !== tokoId));
      alert(`Toko berhasil dihapus.`);
    }
  };

  // --- Filtering dan Pagination untuk Tabel ---
  const filteredToko = daftarToko.filter(toko =>
    toko.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedToko = filteredToko.slice(0, itemsPerPage);


  // Fungsi untuk mendapatkan urutan pasangan yang benar untuk header tabel preferensi per kriteria
  const getOrderedPairs = () => {
    const pairs = [];
    if (daftarToko.length < 2) return [];

    for (let i = 0; i < daftarToko.length; i++) {
      for (let j = 0; j < daftarToko.length; j++) {
        if (i !== j) {
          pairs.push(`${daftarToko[i].nama.toLowerCase()},${daftarToko[j].nama.toLowerCase()}`);
        }
      }
    }
    return pairs.sort();
  };

  const orderedPairs = getOrderedPairs(); // Untuk Tabel Indeks Preferensi (Tabel 3)


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">DAFTAR TOKO</h1>

      {/* Bagian Form Tambah Toko */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <InputField
            label="Nama Toko"
            id="namaToko"
            value={namaToko}
            onChange={(e) => setNamaToko(e.target.value)}
            placeholder="nama toko"
          />

          {/* Dropdown Harga (diisi dari localStorage) */}
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
              Harga
            </label>
            <select
              id="harga"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            >
              <option value="">Pilih Harga</option>
              {getSubCriteriaOptions('Harga').map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Kualitas (diisi dari localStorage) */}
          <div>
            <label htmlFor="kualitas" className="block text-sm font-medium text-gray-700 mb-1">
              Kualitas
            </label>
            <select
              id="kualitas"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kualitas}
              onChange={(e) => setKualitas(e.target.value)}
            >
              <option value="">Pilih Kualitas</option>
              {getSubCriteriaOptions('Kualitas').map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Garansi (diisi dari localStorage) */}
          <div>
            <label htmlFor="garansi" className="block text-sm font-medium text-gray-700 mb-1">
              Garansi
            </label>
            <select
              id="garansi"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={garansi}
              onChange={(e) => setGaransi(e.target.value)}
            >
              <option value="">Pilih Garansi</option>
              {getSubCriteriaOptions('Garansi').map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Ketersediaan Barang (diisi dari localStorage) */}
          <div>
            <label htmlFor="ketersediaanBarang" className="block text-sm font-medium text-gray-700 mb-1">
              Ketersediaan Barang
            </label>
            <select
              id="ketersediaanBarang"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ketersediaanBarang}
              onChange={(e) => setKetersediaanBarang(e.target.value)}
            >
              <option value="">Pilih Ketersediaan</option>
              {getSubCriteriaOptions('Ketersediaan Barang').map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Lama Kredit (diisi dari localStorage) */}
          <div>
            <label htmlFor="lamaKredit" className="block text-sm font-medium text-gray-700 mb-1">
              Lama Kredit
            </label>
            <select
              id="lamaKredit"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lamaKredit}
              onChange={(e) => setLamaKredit(e.target.value)}
            >
              <option value="">Pilih Lama Kredit</option>
              {getSubCriteriaOptions('Lama Kredit').map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button onClick={handleTambahToko}>Tambah Toko</Button>
        </div>
      </div>

    {/* Tabel Rangking Promethee Toko */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Rangking Promethee Toko</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <select
              className="bg-gray-200 px-4 py-2 rounded-lg appearance-none cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <InputField
            placeholder="Pencarian"
            className="w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">NO</th>
                <th className="py-3 px-6 text-left">Nama Toko</th>
                <th className="py-3 px-6 text-left">Harga</th>
                <th className="py-3 px-6 text-left">Kualitas</th>
                <th className="py-3 px-6 text-left">Garansi</th>
                <th className="py-3 px-6 text-left">Ketersediaan Barang</th>
                <th className="py-3 px-6 text-left">Lama Kredit</th>
                <th className="py-3 px-6 text-left">Entring Flow</th>
                <th className="py-3 px-6 text-left">Leaving Flow</th>
                <th className="py-3 px-6 text-left">Net Flow</th>
                <th className="py-3 px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paginatedToko.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-4 text-center text-gray-500">
                    Tidak ada data toko yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedToko.map((toko) => (
                  <tr key={toko.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{toko.no}</td>
                    <td className="py-3 px-6 text-left">{toko.nama}</td>
                    <td className="py-3 px-6 text-left">{toko.harga}</td>
                    <td className="py-3 px-6 text-left">{toko.kualitas}</td>
                    <td className="py-3 px-6 text-left">{toko.garansi}</td>
                    <td className="py-3 px-6 text-left">{toko.ketersediaanBarang}</td>
                    <td className="py-3 px-6 text-left">{toko.lamaKredit}</td>
                    <td className="py-3 px-6 text-left">{toko.entringFlow}</td>
                    <td className="py-3 px-6 text-left">{toko.leavingFlow}</td>
                    <td className="py-3 px-6 text-left">{toko.netFlow}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        <Button variant="secondary" className="p-2" onClick={() => handleEditToko(toko.id)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" className="p-2" onClick={() => handleDeleteToko(toko.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Bagian Tabel Nilai Kriteria per Toko (Tabel ini sudah ada) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tabel Nilai Kriteria dari Toko</h2>
        <div className="overflow-x-auto">
          {daftarToko.length === 0 ? (
            <p className="py-4 text-center text-gray-500">Tidak ada toko yang ditambahkan untuk menampilkan nilai kriteria.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Kriteria</th>
                  {daftarToko.map((toko) => (
                    <th key={toko.id} className="py-3 px-6 text-left">{toko.nama}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {criteriaData.map((criteria) => (
                  <tr key={criteria.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{criteria.kriteria}</td>
                    {daftarToko.map((toko) => (
                      <td key={`${toko.id}-${criteria.id}`} className="py-3 px-6 text-left">
                        {/* Mengambil nilai numerik berdasarkan kriteria dan toko */}
                        {toko.nilaiKriteria && toko.nilaiKriteria[criteria.kriteria.toLowerCase().replace(/\s/g, '')]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bagian Tabel Indeks Preferensi (Tabel 3) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tabel Indeks Preferensi (Per Kriteria)</h2>
        <div className="overflow-x-auto">
          {daftarToko.length < 2 || criteriaData.length === 0 ? (
            <p className="py-4 text-center text-gray-500">Tambahkan setidaknya 2 toko dan pastikan kriteria telah diatur untuk menghitung indeks preferensi per kriteria.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th rowSpan="2" className="py-3 px-6 text-left border-b">K</th>
                  {orderedPairs.map(pair => (
                    <th colSpan="2" className="py-3 px-6 text-center border-b" key={pair}>
                      {pair.replace(',', '.')}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  {orderedPairs.map(pair => (
                    <React.Fragment key={`${pair}-subheaders`}>
                      <th className="py-2 px-4 text-center border-t">d</th>
                      <th className="py-2 px-4 text-center border-t">H(d)</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {criteriaData.map((criteria, idx) => (
                  <tr key={criteria.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{`K${idx + 1}`}</td>
                    {orderedPairs.map(pair => {
                      const pairData = preferenceIndexes[pair];
                      const critKey = criteria.kriteria.toLowerCase().replace(/\s/g, '');
                      const values = pairData && pairData[critKey] ? pairData[critKey] : { d: '', H_d: '' };
                      return (
                        <React.Fragment key={`${pair}-${criteria.id}-values`}>
                          <td className="py-3 px-4 text-center">{values.d}</td>
                          <td className="py-3 px-4 text-center">{values.H_d}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bagian Tabel Indeks Preferensi Multikriteria (Tabel 4.9) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tabel Indeks Preferensi Multikriteria ($\phi(a,b)$)</h2>
        <div className="overflow-x-auto">
          {daftarToko.length < 2 || criteriaData.length === 0 ? (
            <p className="py-4 text-center text-gray-500">Tambahkan setidaknya 2 toko dan pastikan kriteria telah diatur untuk menghitung indeks preferensi multikriteria.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left"></th> {/* Sudut kiri atas kosong */}
                  {daftarToko.map((toko) => (
                    <th key={toko.id} className="py-3 px-6 text-center">{toko.nama}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {daftarToko.map((rowToko) => (
                  <tr key={`row-${rowToko.id}`} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-semibold">{rowToko.nama}</td>
                    {daftarToko.map((colToko) => {
                      const pairKey = `${rowToko.nama.toLowerCase()},${colToko.nama.toLowerCase()}`;
                      const phiValue = multiCriteriaPreferenceIndexes[pairKey];
                      return (
                        <td key={`${rowToko.id}-${colToko.id}-phi`} className="py-3 px-6 text-center">
                          {phiValue !== undefined ? phiValue : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


      <footer className="mt-8 text-center text-gray-500 text-sm">
        Pemerintah Kota Makassar 2024
      </footer>
    </div>
  );
};

export default PrometheeProses;
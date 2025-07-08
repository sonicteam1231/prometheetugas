import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Pencil, Trash2 } from 'lucide-react';

const PrometheeProses = () => {
  // Key untuk localStorage yang sama dengan halaman kriteria
  const LOCAL_STORAGE_KEY = 'criteriaData';

  // State untuk data kriteria dari localStorage
  const [criteriaData, setCriteriaData] = useState([]);

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
    // Muat daftarToko dari localStorage saat inisialisasi
    try {
      const storedToko = localStorage.getItem('daftarToko'); // Key baru untuk daftar toko
      return storedToko ? JSON.parse(storedToko) : [];
    } catch (error) {
      console.error("Failed to parse daftarToko from localStorage:", error);
      return [];
    }
  });

  // useEffect untuk menyimpan daftarToko ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('daftarToko', JSON.stringify(daftarToko));
  }, [daftarToko]);


  // --- State untuk Pencarian dan Pagination Tabel ---
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // --- Handler untuk Form Tambah Toko ---
  const handleTambahToko = () => {
    if (!namaToko || !harga || !kualitas || !garansi || !ketersediaanBarang || !lamaKredit) {
      alert('Semua field harus diisi!');
      return;
    }

    // Dapatkan nilai numerik dari sub-kriteria yang dipilih
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
      nilaiKriteria: {}, // Inisialisasi objek nilaiKriteria
      // Dummy flow values - akan diganti dengan perhitungan Promethee
      entringFlow: (Math.random() * 0.5).toFixed(1),
      leavingFlow: (Math.random() * 0.5).toFixed(1),
      netFlow: ((Math.random() * 0.5) - 0.25).toFixed(1),
    };

    // Mengisi nilaiKriteria secara dinamis
    criteriaData.forEach(crit => {
        const keyName = crit.kriteria.toLowerCase().replace(/\s/g, ''); // Buat kunci yang konsisten (semua lowercase, tanpa spasi)
        let selectedValue;
        // Sesuaikan dengan nama state form Anda
        if (crit.kriteria === 'Harga') selectedValue = harga;
        else if (crit.kriteria === 'Kualitas') selectedValue = kualitas;
        else if (crit.kriteria === 'Garansi') selectedValue = garansi;
        else if (crit.kriteria === 'Ketersediaan Barang') selectedValue = ketersediaanBarang;
        else if (crit.kriteria === 'Lama Kredit') selectedValue = lamaKredit;

        newToko.nilaiKriteria[keyName] = getNumericValue(crit.kriteria, selectedValue);
    });

    setDaftarToko([...daftarToko, newToko]);

    // Reset form
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

      {/* Bagian Tabel Rangking Promethee Toko */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Rangking Promethee Toko</h2>
        <div className="flex justify-between items-center mb-4">
          {/* Dropdown Jumlah Item per Halaman */}
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
          {/* Input Pencarian */}
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

      {/* Bagian Tabel Nilai Kriteria per Toko */}
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

      <footer className="mt-8 text-center text-gray-500 text-sm">
        Pemerintah Kota Makassar 2024
      </footer>
    </div>
  );
};

export default PrometheeProses;
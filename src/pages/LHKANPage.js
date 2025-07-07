import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Pencil, Trash2 } from 'lucide-react';

const LHKANPage = () => {
  // Key untuk localStorage
  const LOCAL_STORAGE_KEY = 'criteriaData';

  // State untuk form EDIT/TAMBAH KRITERIA
  const [currentCriteriaId, setCurrentCriteriaId] = useState(null);
  const [criteriaName, setCriteriaName] = useState('');
  const [nextCriteriaNo, setNextCriteriaNo] = useState(1); // Akan dihitung ulang dari data localStorage

  // State untuk form EDIT/TAMBAH SUB KRITERIA DAN NILAI
  const [currentSubCriteriaId, setCurrentSubCriteriaId] = useState(null);
  const [selectedCriteriaForSub, setSelectedCriteriaForSub] = useState('');
  const [subCriteriaName, setSubCriteriaName] = useState('');
  const [subCriteriaValue, setSubCriteriaValue] = useState('');

  // State utama untuk data kriteria
  // Inisialisasi dengan fungsi untuk mengambil dari localStorage
  const [criteriaData, setCriteriaData] = useState(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Failed to parse criteria data from localStorage:", error);
      // Jika ada error, kembalikan data default
    }
    // Data default jika localStorage kosong atau error
    return [
      {
        id: 'kriteria-1',
        no: 1,
        kriteria: 'Harga',
        subCriteria: [
          { id: 'harga-1', name: 'Sangat Murah', value: 6 },
          { id: 'harga-2', name: 'Cukup Murah', value: 4 },
          { id: 'harga-3', name: 'Mahal', value: 2 },
        ],
      },
      {
        id: 'kriteria-2',
        no: 2,
        kriteria: 'Kualitas',
        subCriteria: [
          { id: 'kualitas-1', name: 'Sangat Bagus', value: 6 },
          { id: 'kualitas-2', name: 'Cukup Bagus', value: 4 },
          { id: 'kualitas-3', name: 'Kurang Bagus', value: 2 },
          { id: 'kualitas-4', name: 'Tidak Ada', value: 0 },
        ],
      },
      {
        id: 'kriteria-3',
        no: 3,
        kriteria: 'Garansi',
        subCriteria: [
          { id: 'garansi-1', name: 'Jangka Panjang', value: 5 },
          { id: 'garansi-2', name: 'Jangka Pendek', value: 3 },
          { id: 'garansi-3', name: 'Tidak Ada', value: 1 },
        ],
      },
      {
        id: 'kriteria-4',
        no: 4,
        kriteria: 'Ketersediaan Barang',
        subCriteria: [
          { id: 'ketersediaan-1', name: 'Sangat Lengkap', value: 6 },
          { id: 'ketersediaan-2', name: 'Cukup Lengkap', value: 4 },
          { id: 'ketersediaan-3', name: 'Kurang Lengkap', value: 2 },
        ],
      },
      {
        id: 'kriteria-5',
        no: 5,
        kriteria: 'Lama Kredit',
        subCriteria: [
          { id: 'kredit-1', name: '2 Bulan', value: 6 },
          { id: 'kredit-2', name: '1 Bulan', value: 4 },
          { id: 'kredit-3', name: 'Tidak Ada', value: 2 },
        ],
      },
    ];
  });

  // useEffect untuk menyimpan data ke localStorage setiap kali criteriaData berubah
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(criteriaData));
  }, [criteriaData]); // Dependensi: criteriaData

  // useEffect untuk memperbarui nextCriteriaNo berdasarkan data yang ada
  // Ini harus dijalankan setelah criteriaData diinisialisasi dari localStorage
  useEffect(() => {
    if (criteriaData.length > 0) {
      const maxNo = Math.max(...criteriaData.map(c => c.no));
      setNextCriteriaNo(maxNo + 1);
    } else {
      setNextCriteriaNo(1);
    }
  }, [criteriaData]); // Dependensi: criteriaData, sehingga selalu update nomor berikutnya

  // Fungsi untuk menambah atau mengedit Kriteria utama
  const handleSaveCriteria = () => {
    if (criteriaName.trim() === '') {
      alert('Nama Kriteria tidak boleh kosong!');
      return;
    }

    if (currentCriteriaId) {
      // Logic untuk EDIT Kriteria
      setCriteriaData(prevData =>
        prevData.map(crit =>
          crit.id === currentCriteriaId ? { ...crit, kriteria: criteriaName } : crit
        )
      );
      setCurrentCriteriaId(null);
    } else {
      // Logic untuk TAMBAH Kriteria baru
      const newCriteria = {
        id: `kriteria-${Date.now()}`,
        no: nextCriteriaNo,
        kriteria: criteriaName,
        subCriteria: [],
      };
      setCriteriaData(prevData => [...prevData, newCriteria]);
      // nextCriteriaNo akan otomatis diupdate oleh useEffect
    }
    setCriteriaName('');
  };

  // Fungsi untuk mengisi form edit kriteria
  const handleEditCriteria = (criteriaId) => {
    const criteriaToEdit = criteriaData.find(crit => crit.id === criteriaId);
    if (criteriaToEdit) {
      setCurrentCriteriaId(criteriaToEdit.id);
      setCriteriaName(criteriaToEdit.kriteria);
    }
  };

  // Fungsi untuk menghapus kriteria utama
  const handleDeleteCriteria = (criteriaId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kriteria ini dan semua sub-kriterianya?')) {
      setCriteriaData(prevData => prevData.filter(crit => crit.id !== criteriaId));
    }
  };

  // Fungsi untuk menambah atau mengedit Sub Kriteria dan Nilai
  const handleSaveSubCriteria = () => {
    if (selectedCriteriaForSub === '' || subCriteriaName.trim() === '' || subCriteriaValue.trim() === '') {
      alert('Pilih Kriteria, isi Nama Sub Kriteria dan Nilai!');
      return;
    }

    const valueNum = parseInt(subCriteriaValue);
    if (isNaN(valueNum)) {
      alert('Nilai harus berupa angka!');
      return;
    }

    if (currentSubCriteriaId) {
      // Logic untuk EDIT Sub Kriteria
      setCriteriaData(prevData =>
        prevData.map(crit => {
          if (crit.id === selectedCriteriaForSub) {
            return {
              ...crit,
              subCriteria: crit.subCriteria.map(sub =>
                sub.id === currentSubCriteriaId ? { ...sub, name: subCriteriaName, value: valueNum } : sub
              ),
            };
          }
          return crit;
        })
      );
      setCurrentSubCriteriaId(null);
    } else {
      // Logic untuk TAMBAH Sub Kriteria baru
      setCriteriaData(prevData =>
        prevData.map(crit =>
          crit.id === selectedCriteriaForSub
            ? {
                ...crit,
                subCriteria: [
                  ...crit.subCriteria,
                  { id: `sub-${Date.now()}`, name: subCriteriaName, value: valueNum },
                ],
              }
            : crit
        )
      );
    }
    setSelectedCriteriaForSub('');
    setSubCriteriaName('');
    setSubCriteriaValue('');
  };

  // Fungsi untuk mengisi form edit sub-kriteria
  const handleEditSubCriteria = (criteriaId, subId) => {
    const criteriaToEdit = criteriaData.find(crit => crit.id === criteriaId);
    if (criteriaToEdit) {
      const subToEdit = criteriaToEdit.subCriteria.find(sub => sub.id === subId);
      if (subToEdit) {
        setCurrentSubCriteriaId(subToEdit.id);
        setSelectedCriteriaForSub(criteriaId);
        setSubCriteriaName(subToEdit.name);
        setSubCriteriaValue(subToEdit.value.toString());
      }
    }
  };

  // Fungsi untuk menghapus sub-kriteria
  const handleDeleteSubCriteria = (criteriaId, subId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sub-kriteria ini?')) {
      setCriteriaData(prevData =>
        prevData.map(criteria => {
          if (criteria.id === criteriaId) {
            return {
              ...criteria,
              subCriteria: criteria.subCriteria.filter(sub => sub.id !== subId),
            };
          }
          return criteria;
        }).filter(criteria => criteria.subCriteria.length > 0)
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">PENGATURAN KRITERIA & NILAI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* EDIT & TAMBAH KRITERIA UTAMA */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {currentCriteriaId ? 'EDIT KRITERIA' : 'TAMBAH KRITERIA BARU'}
          </h2>
          <div className="space-y-4">
            <InputField
              label="Nama Kriteria"
              id="namaKriteria"
              value={criteriaName}
              onChange={(e) => setCriteriaName(e.target.value)}
              placeholder="Contoh: Harga, Kualitas"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <Button onClick={handleSaveCriteria}>
                {currentCriteriaId ? 'Simpan Perubahan Kriteria' : 'Tambah Kriteria'}
              </Button>
              {currentCriteriaId && (
                <Button variant="secondary" onClick={() => {
                  setCurrentCriteriaId(null);
                  setCriteriaName('');
                }}>
                  Batal Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* EDIT DAN TAMBAH SUB KRITERIA DAN NILAI */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {currentSubCriteriaId ? 'EDIT SUB KRITERIA & NILAI' : 'TAMBAH SUB KRITERIA & NILAI'}
          </h2>
          <div className="space-y-4">
            <label htmlFor="selectCriteria" className="block text-sm font-medium text-gray-700">
              Pilih Kriteria Utama
            </label>
            <select
              id="selectCriteria"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedCriteriaForSub}
              onChange={(e) => setSelectedCriteriaForSub(e.target.value)}
              disabled={!!currentSubCriteriaId}
            >
              <option value="">-- Pilih Kriteria --</option>
              {criteriaData.map((criteria) => (
                <option key={criteria.id} value={criteria.id}>
                  {criteria.kriteria}
                </option>
              ))}
            </select>

            <InputField
              label="Nama Sub Kriteria"
              id="namaSubKriteria"
              value={subCriteriaName}
              onChange={(e) => setSubCriteriaName(e.target.value)}
              placeholder="Contoh: Sangat Murah, Jangka Panjang"
            />
            <InputField
              label="Nilai Sub Kriteria"
              id="nilaiSubKriteria"
              type="number"
              value={subCriteriaValue}
              onChange={(e) => setSubCriteriaValue(e.target.value)}
              placeholder="Contoh: 6, 4, 2"
            />
          </div>
          <div className="mt-6 text-right space-x-4">
            <Button onClick={handleSaveSubCriteria}>
              {currentSubCriteriaId ? 'Simpan Perubahan Sub Kriteria' : 'Tambah Sub Kriteria'}
            </Button>
            {currentSubCriteriaId && (
              <Button variant="secondary" onClick={() => {
                setCurrentSubCriteriaId(null);
                setSelectedCriteriaForSub('');
                setSubCriteriaName('');
                setSubCriteriaValue('');
              }}>
                Batal Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Kriteria dan Nilai */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">DAFTAR KRITERIA DAN NILAI</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan="2" className="py-2 px-4 border border-gray-400 text-left text-sm font-semibold w-10">NO</th>
                <th rowSpan="2" className="py-2 px-4 border border-gray-400 text-left text-sm font-semibold w-1/4">KRITERIA</th>
                <th colSpan="2" className="py-2 px-4 border border-gray-400 text-center text-sm font-semibold w-1/2">NILAI</th>
                <th rowSpan="2" className="py-2 px-4 border border-gray-400 text-center text-sm font-semibold w-24">AKSI KRITERIA</th>
                <th rowSpan="2" className="py-2 px-4 border border-gray-400 text-center text-sm font-semibold w-24">AKSI SUB</th>
              </tr>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-400 text-left text-sm font-semibold">SUB KRITERIA</th>
                <th className="py-2 px-4 border border-gray-400 text-left text-sm font-semibold">NILAI</th>
              </tr>
            </thead>
            <tbody>
              {criteriaData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">Belum ada data kriteria.</td>
                </tr>
              ) : (
                criteriaData.map((criteria) => (
                  criteria.subCriteria.length === 0 ? (
                    <tr key={criteria.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-2 px-4 border border-gray-400 align-top text-sm text-center">{criteria.no}</td>
                      <td className="py-2 px-4 border border-gray-400 align-top text-sm">{criteria.kriteria}</td>
                      <td colSpan="2" className="py-2 px-4 border border-gray-400 text-center text-gray-500">Tidak ada sub-kriteria</td>
                      <td className="py-3 px-6 border border-gray-400 text-center align-top">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="secondary" className="p-2" onClick={() => handleEditCriteria(criteria.id)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="danger" className="p-2" onClick={() => handleDeleteCriteria(criteria.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-6 border border-gray-400 text-center align-top">
                        <span className="text-gray-400">N/A</span>
                      </td>
                    </tr>
                  ) : (
                    criteria.subCriteria.map((sub, subIndex) => (
                      <tr key={`${criteria.id}-${sub.id}`} className="border-b border-gray-200 hover:bg-gray-100">
                        {subIndex === 0 && (
                          <>
                            <td rowSpan={criteria.subCriteria.length} className="py-2 px-4 border border-gray-400 align-top text-sm text-center">
                              {criteria.no}
                            </td>
                            <td rowSpan={criteria.subCriteria.length} className="py-2 px-4 border border-gray-400 align-top text-sm">
                              {criteria.kriteria}
                            </td>
                          </>
                        )}
                        <td className="py-2 px-4 border border-gray-400 text-sm">{sub.name}</td>
                        <td className="py-2 px-4 border border-gray-400 text-sm">{sub.value}</td>
                        {subIndex === 0 && (
                          <td rowSpan={criteria.subCriteria.length} className="py-3 px-6 border border-gray-400 text-center align-top">
                            <div className="flex items-center justify-center space-x-2">
                              <Button variant="secondary" className="p-2" onClick={() => handleEditCriteria(criteria.id)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="danger" className="p-2" onClick={() => handleDeleteCriteria(criteria.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                        <td className="py-3 px-6 border border-gray-400 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="secondary"
                              className="p-2"
                              onClick={() => handleEditSubCriteria(criteria.id, sub.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              className="p-2"
                              onClick={() => handleDeleteSubCriteria(criteria.id, sub.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        Pemerintah Kota Makassar 2024
      </footer>
    </div>
  );
};

export default LHKANPage;
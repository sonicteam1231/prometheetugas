// src/pages/PrometheeProses.jsx
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Pencil, Trash2 } from 'lucide-react';

const LOCAL_STORAGE_CRITERIA = 'lhkan_criteria';

export default function PrometheeProses() {
  // ── Load criteriaData dari Local Storage atau default ──
  const defaultCriteria = [
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

  const [criteriaData, setCriteriaData] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_CRITERIA);
    return stored ? JSON.parse(stored) : defaultCriteria;
  });

  // Simpan criteriaData setiap kali berubah
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CRITERIA, JSON.stringify(criteriaData));
  }, [criteriaData]);

  // ── Helper untuk ambil subCriteria list by nama kriteria ──
  const getSubCriteriaOptions = (critName) => {
    const crit = criteriaData.find(c => c.kriteria === critName);
    return crit ? crit.subCriteria : [];
  };

  // ── State Form Tambah Toko ──
  const [namaToko, setNamaToko] = useState('');
  const [harga, setHarga] = useState('');
  const [kualitas, setKualitas] = useState('');
  const [garansi, setGaransi] = useState('');
  const [ketersediaanBarang, setKetersediaanBarang] = useState('');
  const [lamaKredit, setLamaKredit] = useState('');

  // ── State Daftar Toko ──
  const [daftarToko, setDaftarToko] = useState([]);

  // ── Tambah Toko Handler ──
  const handleTambahToko = () => {
    if (!namaToko || !harga || !kualitas || !garansi || !ketersediaanBarang || !lamaKredit) {
      return alert('Semua field harus diisi!');
    }

    // ambil nilai numeric
    const getVal = (critName, subName) => {
      const crit = criteriaData.find(c => c.kriteria === critName);
      const sub = crit?.subCriteria.find(s => s.name === subName);
      return sub ? sub.value : 0;
    };
    const hargaValue = getVal('Harga', harga);
    const kualitasValue = getVal('Kualitas', kualitas);
    const garansiValue = getVal('Garansi', garansi);
    const ketersediaanBarangValue = getVal('Ketersediaan Barang', ketersediaanBarang);
    const lamaKreditValue = getVal('Lama Kredit', lamaKredit);

    const nextNo = daftarToko.length > 0
      ? Math.max(...daftarToko.map(t => t.no)) + 1
      : 1;

    const newToko = {
      no: nextNo,
      nama: namaToko,
      hargaName: harga,
      kualitasName: kualitas,
      garansiName: garansi,
      ketersediaanBarangName: ketersediaanBarang,
      lamaKreditName: lamaKredit,
      hargaValue,
      kualitasValue,
      garansiValue,
      ketersediaanBarangValue,
      lamaKreditValue,
      entringFlow: (Math.random() * 0.5).toFixed(1),
      leavingFlow: (Math.random() * 0.5).toFixed(1),
      netFlow: ((Math.random() * 0.5) - 0.25).toFixed(1),
    };
    setDaftarToko(prev => [...prev, newToko]);

    // reset form
    setNamaToko('');
    setHarga('');
    setKualitas('');
    setGaransi('');
    setKetersediaanBarang('');
    setLamaKredit('');
  };

  // ── Edit & Delete Toko (dummy) ──
  const handleEditToko = no => alert(`Edit Toko No: ${no}`);
  const handleDeleteToko = no => {
    if (window.confirm(`Hapus Toko No: ${no}?`)) {
      setDaftarToko(prev => prev.filter(t => t.no !== no));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">DAFTAR TOKO & PROMETHEE</h1>

      {/* Form Tambah Toko */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Tambah Toko</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nama Toko" value={namaToko}
            onChange={e => setNamaToko(e.target.value)}
          />

          {/* Dropdown per kriteria */}
          {['Harga','Kualitas','Garansi','Ketersediaan Barang','Lama Kredit'].map(field => {
            const stateMap = {
              'Harga': [harga, setHarga],
              'Kualitas': [kualitas, setKualitas],
              'Garansi': [garansi, setGaransi],
              'Ketersediaan Barang': [ketersediaanBarang, setKetersediaanBarang],
              'Lama Kredit': [lamaKredit, setLamaKredit],
            };
            const [val, setter] = stateMap[field];
            return (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">{field}</label>
                <select
                  className="border px-3 py-2 rounded-lg w-full"
                  value={val}
                  onChange={e => setter(e.target.value)}
                >
                  <option value="">-- Pilih {field} --</option>
                  {getSubCriteriaOptions(field).map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-right">
          <Button onClick={handleTambahToko}>Tambah Toko</Button>
        </div>
      </div>

      {/* Tabel Rangking Promethee */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Rangking Promethee</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                {['NO','Nama Toko','Harga','Kualitas','Garansi','Ketersediaan','Lama Kredit','Entring Flow','Leaving Flow','Net Flow','Action']
                  .map(h => (
                    <th key={h} className="py-2 px-4 border">{h}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {daftarToko.length === 0 ? (
                <tr><td colSpan={11} className="py-4 text-center">Belum ada data</td></tr>
              ) : daftarToko.map(t => (
                <tr key={t.no} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{t.no}</td>
                  <td className="py-2 px-4">{t.nama}</td>
                  <td className="py-2 px-4">{t.hargaName}</td>
                  <td className="py-2 px-4">{t.kualitasName}</td>
                  <td className="py-2 px-4">{t.garansiName}</td>
                  <td className="py-2 px-4">{t.ketersediaanBarangName}</td>
                  <td className="py-2 px-4">{t.lamaKreditName}</td>
                  <td className="py-2 px-4">{t.entringFlow}</td>
                  <td className="py-2 px-4">{t.leavingFlow}</td>
                  <td className="py-2 px-4">{t.netFlow}</td>
                  <td className="py-2 px-4 text-center">
                    <Button variant="secondary" size="sm" onClick={() => handleEditToko(t.no)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteToko(t.no)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Nilai dari Sample */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Tabel Nilai dari Sample</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border py-2 px-3 text-left">Kriteria</th>
                {daftarToko.map(t => (
                  <th key={t.no} className="border py-2 px-3 text-center">{t.nama}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteriaData.map(c => {
                const mapKey = {
                  'kriteria-1': 'hargaValue',
                  'kriteria-2': 'kualitasValue',
                  'kriteria-3': 'garansiValue',
                  'kriteria-4': 'ketersediaanBarangValue',
                  'kriteria-5': 'lamaKreditValue',
                }[c.id];
                return (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="border py-2 px-3">{c.no}. {c.kriteria}</td>
                    {daftarToko.map(t => (
                      <td key={t.no} className="border py-2 px-3 text-center">
                        {mapKey ? t[mapKey] : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

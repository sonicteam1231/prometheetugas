import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Pencil, Trash2 } from 'lucide-react'; // Assuming these are for edit/delete icons

const LHKANPage = () => {
  const [skpdName, setSkpdName] = useState('');
  const [skpdCode, setSkpdCode] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');

  const [nip, setNip] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [noNpwp, setNoNpwp] = useState('');
  const [reportYear, setReportYear] = useState('');

  const [employees, setEmployees] = useState([
    { no: 1, skpd: 'Dinas Kesehatan', kodeSkpd: '001', nama: 'IKHSAN', nip: '199604', noNpwp: '18519849' },
    { no: 2, skpd: 'Dinas Kesehatan', kodeSkpd: '001', nama: 'YADI', nip: '487583', noNpwp: '958949898' },
  ]);

  const handleAddSkpd = () => {
    // Logic to add SKPD
    console.log("Add SKPD:", { skpdName, skpdCode, employeeCount });
    // You would typically make an API call here
  };

  const handleAddEmployee = () => {
    // Logic to add Employee
    console.log("Add Employee:", { nip, employeeName, noNpwp, reportYear });
    const newEmployee = {
      no: employees.length + 1,
      skpd: 'New SKPD', // This should come from a selected SKPD or input
      kodeSkpd: '001',
      nama: employeeName,
      nip: nip,
      noNpwp: noNpwp,
    };
    setEmployees([...employees, newEmployee]);
    // Clear form fields
    setNip('');
    setEmployeeName('');
    setNoNpwp('');
    setReportYear('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ACCOUNT DETAIL</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* SKPD Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">SKPD</h2>
          <div className="space-y-4">
            <InputField
              label="Nama SKPD"
              id="namaSkpd"
              value={skpdName}
              onChange={(e) => setSkpdName(e.target.value)}
              placeholder="Nama SKPD"
            />
            <InputField
              label="Kode SKPD"
              id="kodeSkpd"
              value={skpdCode}
              onChange={(e) => setSkpdCode(e.target.value)}
              placeholder="Kode OPD"
            />
            <InputField
              label="Jumlah Pegawai"
              id="jumlahPegawai"
              type="number"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              placeholder="SKPD"
            />
            <div className="flex space-x-4 mt-4">
              <Button variant="success">Upload Excel</Button>
              <Button onClick={handleAddSkpd}>Add SKPD</Button>
            </div>
          </div>
        </div>

        {/* Catatan Review Dalnis Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Catatan Review Dalnis</h2>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="NIP"
              id="nip"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="NIP"
            />
            <InputField
              label="Nama Pegawai"
              id="namaPegawai"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="nama pegawai"
            />
            <InputField
              label="NO NPWP"
              id="noNpwp"
              value={noNpwp}
              onChange={(e) => setNoNpwp(e.target.value)}
              placeholder="No NPWP"
            />
            <InputField
              label="Tahun Lapor"
              id="tahunLapor"
              type="number"
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
              placeholder="tahun"
            />
          </div>
          <div className="mt-6 text-right">
            <Button onClick={handleAddEmployee}>Tambah Pegawai</Button>
          </div>
        </div>
      </div>

      {/* Daftar Nama Pegawai Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">DAFTAR NAMA PEGAWAI</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <select className="bg-gray-200 px-4 py-2 rounded-lg appearance-none cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <InputField placeholder="Pencarian" className="w-1/3" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">NO</th>
                <th className="py-3 px-6 text-left">SKPD</th>
                <th className="py-3 px-6 text-left">KODE SKPD</th>
                <th className="py-3 px-6 text-left">NAMA</th>
                <th className="py-3 px-6 text-left">NIP</th>
                <th className="py-3 px-6 text-left">NO NPWP</th>
                <th className="py-3 px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {employees.map((employee) => (
                <tr key={employee.no} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{employee.no}</td>
                  <td className="py-3 px-6 text-left">{employee.skpd}</td>
                  <td className="py-3 px-6 text-left">{employee.kodeSkpd}</td>
                  <td className="py-3 px-6 text-left">{employee.nama}</td>
                  <td className="py-3 px-6 text-left">{employee.nip}</td>
                  <td className="py-3 px-6 text-left">{employee.noNpwp}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <Button variant="secondary" className="p-2">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="danger" className="p-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
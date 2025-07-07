  {/* Bagian Daftar Nama Pegawai (opsional, bisa dihapus jika tidak diperlukan lagi) */}
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
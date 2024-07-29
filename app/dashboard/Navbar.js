import React from 'react'
import { Dropdown } from 'flowbite-react';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Select from 'react-select'

const NavBar = ({ symbols }) => {
  const supabase = createClient();
  const router = useRouter();

  console.log("symbols", symbols);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("error in logging out");
    } else {
      router.push("/");
    }
  }

  return (
    <nav className="bg-white p-4 flex justify-between items-center">
      <div className="text-white">
          <Image
            src="/images/ekios.png"
            width={100}
            height={100}
            alt="echios"
            />
      </div>
      <div className="flex gap-4">
        <Select className="w-200" options={symbols.map(symbol => ({label: symbol, value: symbol}))}/>
        <Dropdown
          label={
            <div className="text-black">
              <FaUserCircle size={30} />
            </div>
          }
          inline={true}
          className="text-white"
        >
          <Dropdown.Item>
            <div color="light" onClick={() => {}}>Edit Profile</div>
          </Dropdown.Item>
          <Dropdown.Item>
            <div color="light" onClick={() => {logout()}}>Logout</div>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </nav>
  );
};

export default NavBar;

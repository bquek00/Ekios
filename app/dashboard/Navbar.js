import React from 'react'
import { Dropdown } from 'flowbite-react';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from 'flowbite-react';

const NavBar = () => {
  const supabase = createClient();
  const router = useRouter();

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
        <TextInput type="search" rightIcon={FaSearch} placeholder="Search" />
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

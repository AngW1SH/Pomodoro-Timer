import React, { FC } from "react";

interface ListProps {}

const List: FC<ListProps> = () => {
  return (
    <div className="h-full w-7/12 overflow-auto p-10">
      <div className="relative mb-6 flex cursor-pointer items-end justify-center border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
      <div className="relative mb-6 flex cursor-pointer items-end border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
      <div className="relative mb-6 flex cursor-pointer items-end border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
      <div className="relative mb-6 flex cursor-pointer items-end border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
      <div className="relative mb-6 flex cursor-pointer items-end border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
      <div className="relative mb-6 flex cursor-pointer items-end border border-black py-4">
        <div className="ml-4 mr-5 whitespace-nowrap text-xl font-bold">
          Title
        </div>
        <div className="mr-20 overflow-hidden whitespace-nowrap">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          nemo eaque ratione ut? Ab dignissimos ut, incidunt omnis hic sapiente.
        </div>
        <div className="absolute right-0 top-0 flex h-full w-14 items-center justify-center border-l border-black bg-white">
          1
        </div>
      </div>
    </div>
  );
};

export default List;

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="font-montserrat font-bold text-xl">SportPredictPro</h2>
            <p className="text-gray-400 text-sm mt-1">The ultimate sports prediction platform</p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <a href="#" className="text-gray-300 hover:text-white mx-2 my-1 md:my-0">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white mx-2 my-1 md:my-0">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white mx-2 my-1 md:my-0">FAQs</a>
            <a href="#" className="text-gray-300 hover:text-white mx-2 my-1 md:my-0">Contact</a>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <a href="#" className="mx-2 text-gray-300 hover:text-white"><i className="fab fa-facebook"></i></a>
            <a href="#" className="mx-2 text-gray-300 hover:text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="mx-2 text-gray-300 hover:text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} SportPredictPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

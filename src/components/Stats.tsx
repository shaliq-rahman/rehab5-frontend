const Stats = () => {
    const stats = [
        { value: "25,356", label: "Patients Served" },
        { value: "6,050", label: "Consultations this week" },
        { value: "21", label: "Locations" },
        { value: "95%", label: "Success Rate" },
    ];

    return (
        <section className="w-full bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center space-y-16">
                <div className="space-y-4 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Our Stats show that we've <br />
                        <span className="text-gray-600">Happy Patients</span>
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Access clinical quality partiality estimating terminated day everything.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                            <span className="text-4xl font-bold text-gray-800">{stat.value}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;

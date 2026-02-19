interface Props {
  title: string;
  value: number;
  icon: any;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<Props> = ({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;

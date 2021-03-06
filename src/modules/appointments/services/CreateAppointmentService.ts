import { startOfHour, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';

import AppError from '@shared/errors/AppError';
import getHours from 'date-fns/getHours';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}
@injectable()
class CreateAppointmentServices {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    user_id,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    /** você pode "obter" o repositório usando getCustomRepository e
     * pode acessar qualquer método criado dentro dele e qualquer método
     * no repositório de entidade padrão. */

    const appointmentDate = startOfHour(date);

    // se minha data for antes da data atual
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    // não pode criar um agendamento com o user_id sendo o mesmo provider_id
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "You can't only create appointment between 8am an 5pm",
      );
    }

    // não permitir que o usuário crie um agendamento no mesmo horário
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    //formatando a data
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'ás' HH:mm 'h'");

    // enviando a notificacao

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments: ${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentServices;

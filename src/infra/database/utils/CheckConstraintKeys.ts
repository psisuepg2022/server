enum CheckConstraintKeys {
  "pessoa_check_nascimento" = "ErrorFutureBirthDate",
  "paciente_check_genero" = "ErrorValueOutOfGenderDomain",
  "paciente_check_estado_civil" = "ErrorValueOutOfMaritalStatusDomain",
  "agenda_semanal_check_dia_semana" = "ErrorWeekScheduleDayOfTheWeekInvalid",
  "agenda_semanal_check_horario" = "ErrorWeeklyScheduleInvalidInterval",
  "restricoes_horario_check_horario" = "ErrorScheduleLockIntervalInvalid",
  "restricoes_horario_check_data" = "ErrorScheduleLockPastDate",
  "restricoes_agenda_semanal_check_horario" = "ErrorWeeklyScheduleInvalidInterval",
  "consulta_check_situacao" = "ErrorValueOutOfAppointmentStatusDomain",
  "profissional_duracao_base_check" = "ErrorBaseDurationLessThanZero",
}

export { CheckConstraintKeys };

xml.div do
  if @user.errors.any?
    xml.ul do
      @user.errors.full_messages.each do |e|
        xml.li(e)
      end
    end
  end

  xml << form_for(@user) do |f|
    f.label(t(:username)) + 
    f.text_field(:name) +
    f.label(t(:email)) +
    f.email_field(:email) +
    f.label(t(:password)) +
    f.password_field(:password) +
    f.label(t(:confirm_password)) +
    f.password_field(:password_confirmation) +
    f.submit
  end
end
xml.div(class: 'navbar') do
  xml.ul do
    xml.li do
      xml << link_to(t(:home), root_path)
    end

    if logged_user_id
      xml.li do
        xml << link_to(t(:my_profile), edit_user_path(id: logged_user_id))
      end
      xml.li do
        link_to(t(:logout), logout_path)
      end
    else
      xml.li do
        xml << render(partial: 'sessions/form')
      end
      xml.li do
        xml << link_to(t(:new_user), new_user_path)
      end
    end
  end
end